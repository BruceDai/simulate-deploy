import * as tf from '@tensorflow/tfjs-core';

import {ExecutionContext} from '../compilation';
import {SplitOptions} from '../model_builder';
import {Operand, OutputOperand} from '../operand';
import {Operation} from '../operation';
import * as utils from '../utils';

export class Split extends Operation {
  private input_: Operand;
  private splits_: number|number[];
  private axis_?: number;

  constructor(
      input: Operand, splits: number|number[], options: SplitOptions = {}) {
    super(input.builder);
    utils.validateOperand(input);
    this.input_ = input;
    utils.assert(
        utils.isInteger(splits) || utils.isIntegerArray(splits as number[]),
        'The splits parameter is invalid.');
    this.splits_ = splits;
    utils.assert(
        options.axis === undefined || utils.isInteger(options.axis),
        'The options.axis is invalid.');
    this.axis_ = options.axis;

    // Prepare outputs.
    const numOutputs =
        utils.isInteger(splits) ? splits : (splits as number[]).length;
    for (let i = 0; i < numOutputs; ++i) {
      this.outputs.push(new OutputOperand(this));
    }
  }

  inputs(): Operand[] {
    return [this.input_];
  }

  compute(context: ExecutionContext): void {
    const input: tf.Tensor = context.getTensor(this.input_);
    const tensors = tf.split(input, this.splits_, this.axis_);
    for (let i = 0; i < tensors.length; ++i) {
      context.setOutputTensor(this.outputs[i], tensors[i]);
    }
  }
}
