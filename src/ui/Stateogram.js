import {Config} from "../Config.js"
import {Painter} from "../draw/Painter.js"
import {CircuitStats} from "../circuit/CircuitStats.js"
import {Rect} from "../math/Rect.js"
import {Hand} from "../ui/Hand.js"
import {Point} from "../math/Point.js"
import {Util} from "../base/Util.js"
import {MathPainter} from "../draw/MathPainter.js"
import {Format} from "../base/Format.js"

class Stateogram {
    /**
     * Stateogram displaying for als vectors of computational base square of amplitude amount (probabilitiy) and the
     * angle of the coefficient.
     * @param {!number} top
     */
    constructor(top) {
        this.top = top;
    }

    /**
     * @param {!number} newTop
     * @returns {!Histogram}
     */
    withTop(newTop) {
        return new Stateogram(newTop);
    }

    desiredHeight() {
        return 600;
    }
    
    desiredWidth() {
        return 600;
    }

    /**
     * @param {!Painter} painter
     * @param {!Number} num_wires
     */
    stateogramArea(painter, num_wires) {
        let margin_top = 10;
        let margin_X = Config.TOOLBOX_MARGIN_X;
        let margin_bottom = 170;

        // let width = num_wires < 5 ? this.desiredWidth() - margin_X : painter.canvas.width - margin_X * 2;
        let width = this.desiredWidth() - margin_X;
        let height = this.desiredHeight() - margin_top - margin_bottom;
        return new Rect(margin_X, this.top + margin_top, width, height);
    }

    /**
     * @param {!Painter} painter   
     * @param {!Rect} area
     */
    drawYAxisTitle(painter, area) {
        let r = area.withX(0).withW(Config.TOOLBOX_MARGIN_X / 2);
        let {x, y} = r.center();
        painter.ctx.save();
        painter.ctx.translate(x, y);
        painter.ctx.rotate(-Math.PI/2);
        painter.printLine("Probability (%)", new Rect(-r.h / 2, -r.w / 2, r.h, r.w), 0.5, 'black', 12);
        painter.ctx.restore();
    }
    
    /**
     * @param {!Painter} painter   
     */
    drawXAxisTitle(painter, area, numWires, stats) {
        let margin = (numWires > 5) ? 80 : 40;
        let titleY = area.bottom() + margin; 
        let titleArea = new Rect(area.x, titleY, area.w, 12);
        painter.printLine("Phase (angle)", titleArea, 0.5, 'black', 12);
    }
    
    
    /**
     * @param {!Painter} painter   
     * @param {!Rect} area
     */
    drawAxeNumbers(painter, area) {
        let r = area.withX(Config.TOOLBOX_MARGIN_X / 2).withW(Config.TOOLBOX_MARGIN_X / 2);
        let font_size = 8;
        
        for(let probability of [0, 20, 40, 60, 80, 100]) {
            let y = r.bottom() - r.h * (probability / 100) - 1;
            painter.printLine(probability + "%", new Rect(r.x, y - font_size / 2, Config.TOOLBOX_MARGIN_X / 2, font_size));
        };

        let width = area.w / 10;
        let angle = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
        // let label = ['-\u03C0', '-\u03C0/2', '0', '\u03C0/2', '\u03C0'];
        let label = ['-1 (-\u03C0)', '-i (-\u03C0/2)', '1 (0)', 'i (\u03C0/2)', '-1 (\u03C0)'];
        for(let idx = 0; idx < 5; idx++){
            let x = area.x + (angle[idx] / Math.PI + 1) / 2 * (area.w - width);
            painter.printLine(label[idx], new Rect(x, area.bottom(), width, 24), 0.5);
        }
    }
 
    /**
     * @param {!Painter} painter
     * @param {!Rect} area
     */
    drawAxes(painter, area) {
        let b = area.bottom();
        let { x, w, h } = area;
        for(let probability of [20, 40, 60, 80]) {
            let y = b - h * (probability / 100) - 1;
            painter.strokeLine(new Point(x, y), new Point(x + w, y), 'grey');
        };

        let width = area.w / 30;
        let angle = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
        for(let idx = 0; idx < 5; idx++){
            let x = area.x + (angle[idx] / Math.PI + 1) / 2 * (area.w - width) + width / 2;
            painter.strokeLine(new Point(x, b), new Point(x, b - h), 'grey');
        }

    }
    
    /**
     * @param {!Painter} painter
     * @param {!Hand} hand
     * @param {!CircuitStats} stats
     * @param {!Rect} area
     */
    drawBars(painter, hand, stats, area) {
        let bar_count = stats.finalState.height();
        let acc_prob = 0;
        stats.finalState.getColumn(0).forEach((amplitude, index) => {
            let padding = bar_count < 32 ? area.w / (3 * bar_count) : 0;

            let probability = amplitude.norm2(); 
            let label = `${Util.bin(index, Util.bitSize(bar_count - 1))}`;

            let width = area.w / 30;
            let x = area.x + (amplitude.phase() / Math.PI + 1) / 2 * (area.w - width);

            /* if(bar_count <= 32) { // draw label, if there's enough space.
                painter.printLine(label, new Rect(x, area.bottom(), width, 24), 0.5);
            } else {
                painter.ctx.save();
                
                let labelYOffset = 0.46 * (this.top + this.desiredHeight());  // Almost half the original translation distance

                painter.ctx.translate(x, this.top + labelYOffset);  
                painter.ctx.rotate(-Math.PI / 2);
                painter.printLine(label, new Rect(0, 0, this.top + this.desiredHeight() - area.bottom() + 12, width), 0.5, undefined, undefined, undefined, 0.5);
                
                painter.ctx.restore();
            }
            */

            const isColored = localStorage.getItem('colored_ui') === 'true';
            const isYellowMode = localStorage.getItem('yellow_mode') === 'true';
            let usedColor = Config.SAMPLING_AND_PROBABILITY_COLOR;
            usedColor = "rgb("+Math.floor(255 * index / (bar_count - 1))+','+(0)+','+Math.floor(255 * (1 - index / (bar_count - 1)))+')';
            let usedHighLight = "rgb("+Math.floor(255 * index / (bar_count - 1))+','+(16)+','+Math.floor(255 * (1 - index / (bar_count - 1)))+')';
            if(isColored && isYellowMode) {
                usedColor = Config.YELLOW;
                usedHighLight = Config.YELLOW_HIGHLIGHT;
            }

            if(probability > 0) { // do not draw empty bar
                let height = probability * area.h;
                let start = acc_prob * area.h;
                let y = area.bottom() - start - height;
                let bar = new Rect(x, area.bottom() - start - height, width, height);
                acc_prob += probability

                painter.fillRect(bar, usedColor);
                painter.strokeRect(bar, 'white', 1);
                if(x < area.x + 0.5 * (area.w - width))
                    painter.print(` |${label}⟩`, x + width, y, 'left', 'top', usedColor, 'Arial', 100, height, undefined, false, 2);
                else
                    painter.print(`|${label}⟩ `, x, y, 'right', 'top', usedColor, 'Arial', 100, height, undefined, false, 2);

                if(hand.hoverPoints().some(point => bar.containsPoint(point))) {
                    painter.fillRect(bar, usedHighLight); 
                    painter.strokeRect(bar, 'black', 2);
                    MathPainter.paintDeferredValueTooltip(painter, bar.x + bar.w, bar.y, 
                    `Measured chance of |${label}⟩ (decimal ${index})`,
                    `raw: ${(probability * 100).toFixed(4)}%`,
                    `amplitude: ${amplitude.toString(new Format(false, 0, 5, ", "))}`)
                }
            } 
        });
    }
    

    /**
     * @param {!Painter} painter
     * @param {!CircuitStats} stats
     * @param {!Rect} area
     * @param {!Hand} hand
     * @param {!number} numWires
     */
    outputStateArea(painter, stats, area, hand, numWires) {
        let margin = (numWires > 5) ? 112 : 80;
        let boxWidth = area.w * 0.96;
        let boxHeight = 55;
    
        let boxX = area.center().x - boxWidth / 2;
        let boxY = area.bottom() + margin;
    
        // Text box
        let textBoxRect = new Rect(boxX, boxY, boxWidth, boxHeight);
        painter.fillRect(textBoxRect, 'rgba(223, 223, 223, 0.66)');
        painter.strokeRect(textBoxRect, 'black');
    
        let titleMargin = 10;
        painter.ctx.save();
        painter.ctx.fillStyle = 'black';
        painter.ctx.font = 'bold 12px sans-serif';
        painter.ctx.fillText('Zero phase', textBoxRect.x + titleMargin, textBoxRect.y + titleMargin + 4);
        painter.ctx.restore();
    
        // Formatted string and output state value as text
        let outputState = stats.finalState
            .getColumn(0)
            //.map((amplitude, index) => `${amplitude.toString(new Format(false, 0, 5, ''))}`)
            .map((amplitude, index) => amplitude==0 ? `|${index.toString(2).padStart(numWires, '0')}>` : '')
            .filter((value, index, array)=>(value!==''))
            .join(', ');
        let formattedState = `${outputState}`;
    
        painter.ctx.save();
        painter.ctx.fillStyle = 'black'; 
        painter.ctx.font = '12px arial'; 
        let textY = textBoxRect.y + 30; 
        let textX = textBoxRect.x + 10;
    
        let lineHeight = 16; 
        let maxLines = 2; 
        let words = formattedState.split(' ');
        let currentLine = '';
        let lineCount = 0;
    
        for (let word of words) {
            let testLine = currentLine + word + ' ';
            let testWidth = painter.ctx.measureText(testLine).width;
            if (testWidth > boxWidth - 20) { 
                painter.ctx.fillText(currentLine, textX, textY);
                currentLine = word + ' ';
                textY += lineHeight;
                lineCount++;
    
                if (lineCount === maxLines - 1) {
                    painter.ctx.fillText(currentLine.trim() + ' ...', textX, textY); 
                    break;
                }
            } else {
                currentLine = testLine;
            }
        }
    
        if (lineCount < maxLines) {
            painter.ctx.fillText(currentLine.trim(), textX, textY); 
        }
    
        painter.ctx.restore();
    
        // Copy button
        let buttonWidth = 30;
        let buttonHeight = 30;
        let buttonX = textBoxRect.right() - buttonWidth - 10;
        let buttonY = textBoxRect.y + 5;
    
        let buttonRect = new Rect(buttonX, buttonY, buttonWidth, buttonHeight);
        painter.fillRect(buttonRect, 'transparent'); 
        painter.ctx.save();
        painter.ctx.strokeStyle = 'black';
        painter.ctx.lineWidth = 1.5;
    
        painter.ctx.strokeRect(buttonRect.x + 8, buttonRect.y + 8, 14, 18); 
        painter.ctx.beginPath();
        painter.ctx.arc(buttonRect.x + 15, buttonRect.y + 10, 4, Math.PI, 0); 
        painter.ctx.stroke();
    
        painter.ctx.restore();
    
        painter.canvas.addEventListener('click', (event) => {
            const rect = painter.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
    
            if (
                mouseX >= buttonX &&
                mouseX <= buttonX + buttonWidth &&
                mouseY >= buttonY &&
                mouseY <= buttonY + buttonHeight
            ) {
                navigator.clipboard.writeText(formattedState)
                    .then(() => {
                        console.log('Output state copied to clipboard.');
                        painter.fillRect(buttonRect, 'rgba(136, 136, 136, 0.56)');
                        painter.ctx.strokeRect(buttonRect.x + 8, buttonRect.y + 8, 14, 18); 
                        painter.ctx.beginPath();
                        painter.ctx.arc(buttonRect.x + 15, buttonRect.y + 10, 4, Math.PI, 0); 
                        painter.ctx.stroke();
                    })
                    .catch((err) => {
                        console.error('Failed to copy output state: ', err);
                    });
            }
        });
    }

    /**
     * @param {!Painter} painter
     * @param {!CircuitStats} stats
     * @param {!Hand} hand
     */
    paint(painter, stats, hand) {
        let { numWires } = stats.circuitDefinition;
        let area = this.stateogramArea(painter, numWires);
    
        this.drawYAxisTitle(painter, area);
        this.drawAxes(painter, area);
        this.drawAxeNumbers(painter, area);
    
        if (numWires <= 17) {
            this.drawBars(painter, hand, stats, area);
        } else {
            painter.printLine("stateogram not available for more than 17 wires.", area, 0.5, undefined, 16, undefined, 0.5);
        }
    
        this.outputStateArea(painter, stats, area, hand, numWires);
    
        this.drawXAxisTitle(painter, area, numWires, stats);
    
        painter.strokeRect(area);
    }
    
}

export {Stateogram}
