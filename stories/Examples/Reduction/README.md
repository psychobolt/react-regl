# Reduction Example

This example implements a parallel reduction algoritm on the GPU.

Given some elements x0, x1, x2, ..., and a binary operator 'op', the parallel reduction becomes 'op(x0, op(x1, op(x2, ...)))'. For example, given the elements 4, 2, 4, 1, and the operator '+', the parallel reduction will be 11, which is just the sum of the elements.