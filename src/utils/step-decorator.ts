import test from "@playwright/test";

/**
 * A class method decorator that wraps an async method in a Playwright `test.step()`.
 *
 * Generates a step label from the optional template string, replacing `{paramName}`
 * placeholders with the actual argument values at call time. Appends the class name,
 * method name, and source file location to the label for full traceability in reports.
 *
 * @template T - The return type of the decorated method.
 * @param _stepName - Optional step label template. Supports `{paramName}` placeholders
 *   that are resolved against the method's parameter names and default values at runtime.
 *
 * @example
 * // Simple label
 * @step("User clicks 'Accept all' button")
 * async clickAcceptAllButton(): Promise<void> { ... }
 *
 * @example
 * // Label with placeholder — resolved from the argument value
 * @step("User searches for '{query}'")
 * async search(query: string): Promise<void> { ... }
 *
 * @example
 * // Destructured object — each key is available as its own placeholder
 * @step("User selects category '{name}'")
 * async selectCategory({ slug, name }: CategoryValue): Promise<void> { ... }
 */
export function step<T>(_stepName?: string) {
    return function (target: (...args: any[]) => Promise<T>, context: ClassMethodDecoratorContext) {
        return function (this: any, ...args: any[]): Promise<T> {
            const isStatic = typeof this === 'function';
            const className = isStatic ? this.name : getOriginalClass(this, context.name.toString());
            const methodDetails = `${className}.${context.name.toString()}`;

            // Extract function parameter names and default values
            const { paramNames, defaultValues } = extractFunctionParamNames(target);

            // Replace placeholders, considering default values
            const name = _stepName
                ? `${replacePlaceholders(_stepName, args, paramNames, defaultValues)} - ${methodDetails}`
                : methodDetails;

            const error = new Error('Capturing stack trace');
            const stackLines = error.stack?.split('\n') || [];
            const stack = stackLines.find(line => line.includes('.ts:') && !line.includes('step-decorator.ts'));

            const filePath = stack?.match(/tests\/(.+)/);
            const finalPath = filePath ? `.../${filePath[1]}` : null;

            const stepNameWithStack = `${name} — ${finalPath}`;

            return test.step(stepNameWithStack, async () => {
                return await target.call(this, ...args);
            });
        };
    };
}

/**
 * Converts a value into a human-readable string for use in step labels.
 * - `Set` instances are serialised as a JSON array.
 * - Objects are pretty-printed as JSON.
 * - Primitives are returned as-is (cast to string).
 *
 * @param value - The value to format.
 * @returns A string representation of the value.
 */
function formatValue(value: any): string {
    if (value instanceof Set) {
        return JSON.stringify([...value], null, 2); // Convert Set to Array before stringifying
    }
    if (typeof value === "object" && value !== null) {
        return JSON.stringify(value, null, 2); // Pretty-print objects for readability
    }
    return value as string; // Ensure it is always a string
}

/**
 * Replaces `{paramName}` placeholders in a step label template with the actual
 * argument values passed to the decorated method.
 *
 * When an argument is `null` or `undefined`, the corresponding default parameter
 * value (extracted from the function source) is used as a fallback.
 *
 * Destructured object parameters (e.g. `{ slug, name }`) are expanded so that
 * each property key becomes its own replaceable placeholder.
 *
 * @param template - The step label template string, e.g. `"User selects '{name}'"`.
 * @param values - The actual argument values passed to the method at call time.
 * @param paramNames - The parameter names extracted from the method signature.
 * @param defaultValues - A map of parameter name → default value, used as fallback.
 * @returns The template string with all matching placeholders replaced.
 */
function replacePlaceholders(template: string, values: any[], paramNames: string[], defaultValues: Record<string, any>): string {
    let result = template;

    for (const [index, param] of paramNames.entries()) {
        const value = values[index] == null ? defaultValues[param] : values[index]; // Use passed value or default

        // handle for named parameters
        if (param.startsWith("{") && typeof value === "object" && value !== null) {

            // Iterate over all keys in the object
            for (const key of Object.keys(value)) {
                replacePlaceholderParam(key, value[key]);
            }

        }

        else {
            replacePlaceholderParam(param, value);
        }

    }

    function replacePlaceholderParam(replaceParamName:string, value:any): void{
        const regex = new RegExp(`{${replaceParamName}}`, "g");
        result = result.replace(regex, formatValue(value) ?? "null"); // Replace only if param exists
    }

    return result;
}

/**
 * Parses a function's source code to extract its parameter names and default values.
 *
 * Handles:
 * - Simple parameters: `(query: string)`
 * - Parameters with defaults: `(message = 'default text')`
 * - Destructured objects: `({ slug, name }: CategoryValue)`
 *
 * @param func - The function whose signature should be parsed.
 * @returns An object containing:
 *   - `paramNames` — ordered list of parameter name tokens as they appear in the signature.
 *   - `defaultValues` — a map of parameter name → evaluated default value.
 */
function extractFunctionParamNames(func: (...args: any[]) => any): { paramNames: string[], defaultValues: Record<string, any> } {
    const fnStr = func.toString();
    const match = fnStr.match(/\((.*?)\)/s); // Match function parameters inside ()
    if (!match) return { paramNames: [], defaultValues: {} };

    const paramStr = match[1].replace(/\s+/g, ' ').trim(); // Normalize spaces
    const paramNames: string[] = [];
    const defaultValues: Record<string, any> = {};
    let braceCount = 0;
    let currentParam = "";

    for (const char of paramStr) {
        if (char === '{') braceCount++; // Handle destructured objects
        if (char === '}') braceCount--;

        if (char === ',' && braceCount === 0) {
            processParam(currentParam.trim());
            currentParam = "";
        } else {
            currentParam += char;
        }
    }
    if (currentParam) processParam(currentParam.trim()); // Process the last parameter

    function processParam(param: string): void {
        if (!param) return;

        const [paramName, defaultValue] = param.split("=").map(p => p.trim());

        paramNames.push(paramName);
        if (defaultValue !== undefined) {
            try {
                // Convert default values from string to proper type (number, boolean, object)
                defaultValues[paramName] = eval(`(${defaultValue})`);
            } catch {
                defaultValues[paramName] = defaultValue; // Fallback to string if parsing fails
            }
        }
    }

    return { paramNames, defaultValues };
}

/**
 * Walks the prototype chain of a class instance to find the class that originally
 * defines a given method. Used to resolve the correct class name in the step label
 * when a method is inherited.
 *
 * @param instance - The class instance (`this` inside the decorated method).
 * @param methodName - The name of the method to locate on the prototype chain.
 * @returns The name of the class that defines the method, or the instance's own
 *   constructor name if the method is not found on any prototype.
 */
function getOriginalClass(instance: any, methodName: string): string {
    let proto = instance;
    while (proto && proto !== Object.prototype) {
        if (Object.prototype.hasOwnProperty.call(proto, methodName)) {
            return proto.constructor.name; // Return the defining class name
        } else {
            proto = Object.getPrototypeOf(proto);
        }
    }
    return instance.constructor.name; // Fallback to the instance class
}
