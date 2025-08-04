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

/**
 * Configuration parameters for quantum circuit visualizer.
 */
class Config {}

Config.EMPTY_CIRCUIT_TITLE = 'Quirk-E: Quantum Circuit Simulator';

const isDarkMode = localStorage.getItem('dark_mode') === 'true';

// Each qubit (when actually used) doubles the cost of simulating each gate applied to the circuit.
// Also each qubit tends to increase the amount of accuracy required.
// I see obvious errors when I set this to 20, and things get pretty laggy past 16.
// Beware setting it too high.
Config.MAX_WIRE_COUNT = 20;
Config.SIMPLE_SUPERPOSITION_DRAWING_WIRE_THRESHOLD = 14;

Config.MIN_WIRE_COUNT = 2;
Config.MIN_COL_COUNT = 5;
Config.URL_CIRCUIT_PARAM_KEY = 'circuit';

// Gate background colors without using colors.
Config.GATE_FILL_COLOR = 'white';
Config.HIGHLIGHTED_GATE_FILL_COLOR = '#c9c9c9';
Config.TIME_DEPENDENT_HIGHLIGHT_COLOR = '#ece8e8';

// Mixed-state displays are green.
Config.DISPLAY_GATE_IN_TOOLBOX_FILL_COLOR = '#d2d8c1';
Config.DISPLAY_GATE_BACK_COLOR = isDarkMode ? '#EAFAF2' : '#F2FAEA';
Config.DISPLAY_GATE_FORE_COLOR = isDarkMode ? '#90BDA6' : '#A9BE91';

// Changes are yellow.
Config.OPERATION_BACK_COLOR = isDarkMode ? '#F2FAEA' : '#F2FAEA';
Config.OPERATION_FORE_COLOR = isDarkMode ? '#FF6809' : '#FFFF06';

// Pure-state displays are cyan.
Config.SUPERPOSITION_BACK_COLOR = isDarkMode ? '#DEECEC' : '#DEE3EC';
Config.SUPERPOSITION_MID_COLOR = isDarkMode ? '#B6E7E7' : '#B6C9E6';
Config.SUPERPOSITION_FORE_COLOR = isDarkMode ? '#639394' : '#637694';

// Time constants.
Config.CYCLE_DURATION_MS = 8000; // How long it takes for evolving gates to cycle, in milliseconds.
Config.TIME_CACHE_GRANULARITY = 196; // The number of buckets the cycle is divided into.
Config.REDRAW_COOLDOWN_MILLIS = 10; // Milliseconds. Rate-limit on redraws. Long draws pad this limit.

/** Half of the span of a drawn gate, width-wise and height-wise.
* @type {!number} */
Config.GATE_RADIUS = 20;
Config.WIRE_SPACING = 50;

Config.BACKGROUND_COLOR = '#FFFFFF';
Config.BACKGROUND_COLOR_CIRCUIT = '#FFFFFF';

// Toolbox layout.
Config.BACKGROUND_COLOR_TOOLBOX = '#CCCCCC';
Config.TOOLBOX_GATE_SPACING = 6;
Config.TOOLBOX_GROUP_SPACING = 24 - Config.TOOLBOX_GATE_SPACING;
Config.TOOLBOX_GATE_SPAN = Config.GATE_RADIUS * 2 + Config.TOOLBOX_GATE_SPACING;
Config.TOOLBOX_GROUP_SPAN = Config.TOOLBOX_GATE_SPAN * 2 + Config.TOOLBOX_GROUP_SPACING;
Config.TOOLBOX_MARGIN_X = 35;
Config.TOOLBOX_MARGIN_Y = 35;

/**
 * Some tooltips end up looking terrible without available vertical space.
 * (e.g. the error box might not fit, or the gate tips might get squashed)
 * @type {number}
 */
Config.MINIMUM_CANVAS_HEIGHT = 500;

Config.SUPPRESSED_GLSL_WARNING_PATTERNS = [];

// Draw constants.
Config.DEFAULT_FILL_COLOR = 'white';
Config.DEFAULT_STROKE_COLOR = 'black';
Config.DEFAULT_TEXT_COLOR = 'black';
Config.DEFAULT_FONT_SIZE = 12;
Config.DEFAULT_FONT_FAMILY = 'sans-serif';
Config.DEFAULT_STROKE_THICKNESS = 1;

// Calling WebGLRenderingContext.getError forces a CPU/GPU sync. It's very expensive.
Config.CHECK_WEB_GL_ERRORS_EVEN_ON_HOT_PATHS = false;
Config.SEMI_STABLE_RANDOM_VALUE_LIFETIME_MILLIS = 300;

Config.IGNORED_WEBGL_INFO_TERMS = [];

// Colored version color codes.
Config.ROTATION_AND_TURNS_COLOR = isDarkMode ? '#EFAA92' : '#EFDC92';
Config.ROTATION_AND_TURNS_HIGHLIGHT = isDarkMode ? '#cf9480' : '#edd265';
Config.LOGICAL_AND_PARITY_COLOR = isDarkMode ? '#F8AB78' : '#F8AB78';
Config.LOGICAL_AND_PARITY_HIGHLIGHT = isDarkMode ? '#cb8d64' : '#db996e';
Config.MATH_COLOR = isDarkMode ? '#C681AC' : '#B681C6';
Config.MATH_HIGHLIGHT = isDarkMode ? '#a86f93' : '#9d71ab';
Config.VISUALIZATION_AND_PROBES_COLOR = isDarkMode ? '#81D4B0' : '#A8D481';
Config.VISUALIZATION_AND_PROBES_HIGHLIGHT = isDarkMode ? '#69ad90' : '#8db26d';
Config.DEFAULT_GATE_COLOR = isDarkMode ? '#8f5656' : '#e35555';
Config.DEFAULT_GATE_HIGHLIGHT = isDarkMode ? '#982d2d' : '#e43535';
Config.SAMPLING_AND_PROBABILITY_COLOR = isDarkMode ? '#8ACFF8' : '#899BF7';
Config.SAMPLING_AND_PROBABILITY_HIGHLIGHT = isDarkMode ? '#74afd1' : '#7786d4';
Config.OTHER_COLOR = isDarkMode ? '#E3E1E1' : '#E1E0DF';
Config.OTHER_HIGHLIGHT = isDarkMode ? '#bfbdbd' : '#c2c0bf';
Config.DARK_BG = '#6d6d6d';
Config.DARK_BG_CIRCUIT = '#6d6d6d';
Config.DARK_BG_TOOLBOX = '#5D5B5B';
Config.RED = '#762020';
Config.YELLOW = '#efdd92';
Config.YELLOW_HIGHLIGHT = '#edd265';

export {Config}
