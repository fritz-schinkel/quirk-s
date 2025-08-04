/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Gate} from "../circuit/Gate.js"
import {ketArgs, ketShaderPermute, ketInputGateShaderCode} from "../circuit/KetShaderUtil.js"
import {
    modularMultiply,
    modularUnmultiply,
    MODULAR_INVERSE_SHADER_CODE
} from "./ModularMultiplicationGates.js"
import {Config} from "../Config.js"
import {GatePainting} from "../draw/GatePainting.js"

let MultiplicationGates = {};

const MULTIPLICATION_SHADER = ketShaderPermute(
    `
        ${MODULAR_INVERSE_SHADER_CODE}
        ${ketInputGateShaderCode('A')}
    `,
    `
        float input_a = read_input_A();
        input_a = mod(input_a, span);
        float v = modular_multiplicative_inverse(input_a, span);
        if (v == -1.0) {
            return out_id;
        }
        return big_mul_mod(out_id, v, span);
    `);

const INVERSE_MULTIPLICATION_SHADER = ketShaderPermute(
    `
        ${MODULAR_INVERSE_SHADER_CODE}
        ${ketInputGateShaderCode('A')}
    `,
    `
        float input_a = read_input_A();
        input_a = mod(input_a, span);
        if (modular_multiplicative_inverse(input_a, span) == -1.0) {
            return out_id;
        }
        return big_mul_mod(out_id, input_a, span);
    `);

function DRAW_GATE (args) {
    const isColored = localStorage.getItem('colored_ui') === 'true';
    const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
    let usedColor = Config.MATH_COLOR;
    let usedHighLight = Config.MATH_HIGHLIGHT;
    if(isColored && isYellowMode) {
        usedColor = Config.YELLOW;
        usedHighLight = Config.YELLOW_HIGHLIGHT;
    }
    if (args.isInToolbox) {
        // Fill the gate with the configured fill color
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        
        // Highlight the gate if needed (when `args.isHighlighted` is true)
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }

        args.painter.strokeRect(args.rect, 'black');
        GatePainting.paintGateSymbol(args);
    }
    else {
        args.painter.fillRect(args.rect, isColored ? usedColor : Config.DEFAULT_FILL_COLOR);
        if (args.isHighlighted) {
            args.painter.fillRect(args.rect, isColored ? usedHighLight : Config.HIGHLIGHTED_GATE_FILL_COLOR, 2);
        }
        args.painter.strokeRect(args.rect);
        GatePainting.paintResizeTab(args);
        GatePainting.paintGateSymbol(args);
    }
}

MultiplicationGates.TimesAFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setSerializedId("*A" + span).
    setSymbol("×A").
    setTitle("Multiplication Gate").
    setBlurb("Multiplies the target by input A.\n" +
        "No effect if the input is even (would be irreversible).").
    setRequiredContextKeys("Input Range A").
    setActualEffectToShaderProvider(ctx => MULTIPLICATION_SHADER.withArgs(...ketArgs(ctx, span, ['A']))).
    setKnownEffectToParametrizedPermutation((x, a) => modularMultiply(x, a, 1<<span)).
    setDrawer(args => DRAW_GATE(args)));

MultiplicationGates.TimesAInverseFamily = Gate.buildFamily(1, 16, (span, builder) => builder.
    setAlternateFromFamily(MultiplicationGates.TimesAFamily).
    setSerializedId("/A" + span).
    setSymbol("×A^-1").
    setTitle("Inverse Multiplication Gate").
    setBlurb("Inverse-multiplies the target by input A (modulo 2^n).\n" +
        "No effect if the input is even (would be irreversible).").
    setRequiredContextKeys("Input Range A").
    setKnownEffectToParametrizedPermutation((x, a) => modularUnmultiply(x, a, 1<<span)).
    setActualEffectToShaderProvider(ctx => INVERSE_MULTIPLICATION_SHADER.withArgs(...ketArgs(ctx, span, ['A']))).
    setDrawer(args => DRAW_GATE(args)));

MultiplicationGates.all = [
    ...MultiplicationGates.TimesAFamily.all,
    ...MultiplicationGates.TimesAInverseFamily.all,
];

export {
    MultiplicationGates,
    MODULAR_INVERSE_SHADER_CODE
}
