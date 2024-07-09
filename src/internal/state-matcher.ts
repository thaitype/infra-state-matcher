import { logger, type Logger } from "./libs/logger.js";
import fs from "node:fs";
import path from "node:path";
import { configMatcherTypeTemplate } from "./templates/config-matcher-type.hbs.js";
import { ConfigMatcherType } from "./config-matcher-type.js";
import type { GenericResourceAnnotation } from "./providers/resource-annotation.schema.js";
import type { StateManager } from "./providers/state-manager.js";
import { TerraformStateManager } from "./providers/terraform/terraform-state-manager.js";
import type { ResourceAnnotation } from "./providers/resource-annotation.js";

type AnyResourceAnnotationAddress = string;
type ResourceAnnotationId = string;

export interface StateMatcherOptions {
  logger: Logger;
  debug: boolean;
  serializedState?: GenericResourceAnnotation[];
  /**
   * Path to the directory where the generated files will be stored.
   */
  generateDir: string;
  /**
   * Path to the terraform state file. The output of `terraform show -json`
   */
  stateFile: string;
  /**
   * Working Directory
   */
  workingDir: string;
  /**
   * State Manager for Handling State with Different Providers
   * @default TerraformStateManager
   */
  stateManager: StateManager;
}

export abstract class StateMatcher {
  public readonly options: StateMatcherOptions;
  public readonly logger: Logger;
  protected serializedState!: GenericResourceAnnotation[];

  protected resourceMap = new Map<AnyResourceAnnotationAddress, GenericResourceAnnotation>();
  protected resourceAnnotationMap = new Map<ResourceAnnotationId, GenericResourceAnnotation>();

  constructor(public readonly annotation: ResourceAnnotation, options: Partial<StateMatcherOptions> = {}) {
    const defaultOptions: StateMatcherOptions = {
      logger: logger,
      debug: false,
      generateDir: "./.gen",
      stateFile: "./prod.state.json",
      serializedState: undefined,
      workingDir: process.cwd(),
      stateManager: new TerraformStateManager(),
    };
    this.options = Object.assign({}, defaultOptions, options);
    const testSuiteDir = this.constructor.name;
    this.options.stateFile = path.join(this.options.workingDir, this.options.stateFile);
    this.options.generateDir = path.join(this.options.workingDir, this.options.generateDir, testSuiteDir);
    this.serializedState = this.options.serializedState!;
    this.logger = this.options.logger;
  }

  private convertToRelativePath(basePath: string, absolutePath: string) {
    return path.relative(basePath, absolutePath);
  }

  /**
   * Label resources with  annotations for matching between two resource states.
   * e.g. For active site and dr site resources.
   */
  public async labelResources(): Promise<void> {
    if (this.options.serializedState === undefined) {
      await this.labelAnnotationsFromFile();
    }
    this.prepareResourceMap();
    this.prepareResourceAnnotationMap();
    this.prepareConfigMatcherType();
  }

  protected async labelAnnotationsFromFile(): Promise<void> {
    fs.mkdirSync(this.options.generateDir, { recursive: true });

    const jsonState = await this.options.stateManager.readAndSerialize(this.options.stateFile);
    const output = this.annotation.label(jsonState);

    if (this.options.debug) {
      // Just copy the original state file to the generate directory
      await fs.promises.copyFile(this.options.stateFile, path.join(this.options.generateDir, "state.json"));
      const outFile = path.join(this.options.generateDir, "labeled.state.json");
      const csvFile = path.join(this.options.generateDir, "annotation.csv");
      await fs.promises.writeFile(outFile, JSON.stringify(output, null, 2));
      logger.debug("Output written to: " + this.convertToRelativePath(this.options.workingDir, outFile));
      await this.annotation.exportPayloadToCsv(csvFile, output);
      logger.debug(" Annotation written to: " + this.convertToRelativePath(this.options.workingDir, csvFile));
    }
    this.serializedState = output;
  }

  protected prepareResourceMap(): void {
    this.validateState();
    this.logger.info("Preparing resource map...");
    for (const resource of this.serializedState) {
      this.resourceMap.set(resource.address, resource);
    }
    if (this.options.debug) {
      this.logger.debug("Writing resource map to file...");

      fs.writeFileSync(
        path.join(this.options.generateDir, "resource-map.json"),
        JSON.stringify(Object.fromEntries(this.resourceMap), null, 2)
      );
    }
  }

  protected prepareResourceAnnotationMap(): void {
    this.validateState();
    this.logger.info("Preparing  annotation map...");
    for (const resource of this.serializedState) {
      if (resource.ism_annotation_id) {
        this.resourceAnnotationMap.set(resource.ism_annotation_id, resource);
      }
    }
    if (this.options.debug) {
      this.logger.debug("Writing  annotation map to file...");
      fs.writeFileSync(
        path.join(this.options.generateDir, "annotation-map.json"),
        JSON.stringify(Object.fromEntries(this.resourceAnnotationMap), null, 2)
      );
    }
  }

  protected prepareConfigMatcherType(): void {
    this.validateState();
    this.logger.info("Preparing config matcher type...");
    const code = configMatcherTypeTemplate({
      stateTypeUnion: new ConfigMatcherType(this.resourceMap).toString(),
    });
    fs.writeFileSync(path.join(this.options.generateDir, "types.ts"), code);
  }

  protected validateState(): asserts this is { state: GenericResourceAnnotation } {
    if (this.serializedState === undefined) {
      throw new Error("State is not initialized, please call labelResources() first.");
    }
  }

  abstract run(): void;
}
