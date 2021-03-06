import * as tf from '@tensorflow/tfjs-core';

import {ExecutionContext} from '../compilation';
import {Operand} from '../operand';
import {SingleOutputOperation} from '../operation';
import * as utils from '../utils';

export class Squeeze extends SingleOutputOperation {
  private input_: Operand;
  private axes_?: number[];

  constructor(input: Operand, axes?: number[]) {
    super(input.builder);
    utils.validateOperand(input);
    this.input_ = input;
    if (axes !== undefined) {
      utils.assert(
          utils.isIntegerArray(axes) && axes.length !== 0,
          'The axes parameter is invalid.');
    }
    this.axes_ = axes;
  }

  inputs(): Operand[] {
    return [this.input_];
  }

  run(context: ExecutionContext): tf.Tensor {
    const input: tf.Tensor = context.getTensor(this.input_);
    return tf.squeeze(input, this.axes_);
  }
}
