import { Diagnostic } from "@codemirror/lint";
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
  VirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import * as Comlink from "comlink";
import lzstring from "lz-string";
import ts from "typescript";

export class TSServer {
  system: ts.System;
  tsEnv: VirtualTypeScriptEnvironment;

  constructor(fsMap: Map<string, string>) {
    this.system = createSystem(fsMap);
    this.tsEnv = createVirtualTypeScriptEnvironment(this.system, [], ts, { allowJs: true });
  }

  static async init() {
    const compilerOptions: ts.CompilerOptions = {};

    const fsMap = await createDefaultMapFromCDN(compilerOptions, ts.version, false, ts, lzstring);

    return new TSServer(fsMap);
  }

  setFile(path: string, data: string) {
    if (this.tsEnv.getSourceFile(path)) {
      this.tsEnv.updateFile(path, data || " ");
    } else {
      this.tsEnv.createFile(path, data || " ");
    }
  }

  getFileInfo(path: string) {
    const SyntacticDiagnostics = this.tsEnv.languageService.getSyntacticDiagnostics(path);
    const SemanticDiagnostic = this.tsEnv.languageService.getSemanticDiagnostics(path);
    const SuggestionDiagnostics = this.tsEnv.languageService.getSuggestionDiagnostics(path);
    type Diagnostics = typeof SyntacticDiagnostics & typeof SemanticDiagnostic & typeof SuggestionDiagnostics;
    const result: Diagnostics = [].concat(SyntacticDiagnostics, SemanticDiagnostic, SuggestionDiagnostics);

    const diagnosticResults = result.map((v) => {
      const from = v.start;
      const to = v.start + v.length;

      const diag: Diagnostic = {
        from,
        to,
        message: v.messageText as string,
        source: v?.source,
        severity: ["warning", "error", "info", "info"][v.category] as Diagnostic["severity"],
      };

      return diag;
    });
    console.log("this.env.getFileInfo:", diagnosticResults);

    return diagnosticResults;
  }
}

const server = await TSServer.init();

Comlink.expose(server);
