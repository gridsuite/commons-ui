/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
type WithoutReadOnly<T> = T extends (...args: infer Args) => infer Result
    ? (...args: Args) => WithoutReadOnly<Result>
    : T extends object
      ? Omit<T, 'readOnly'> & { readOnly?: never }
      : T;

export type SlotPropsWithoutInputReadOnly<T> = T extends object
    ? {
          [Key in keyof T]: Key extends 'input' ? WithoutReadOnly<NonNullable<T[Key]>> : T[Key];
      }
    : T;

export type DistributiveOmit<T, Keys extends PropertyKey> = T extends unknown ? Omit<T, Keys> : never;

export type PropsWithoutInputReadOnly<T> = T extends { slotProps?: infer SlotProps }
    ? Omit<T, 'slotProps'> & {
          slotProps?: SlotPropsWithoutInputReadOnly<NonNullable<SlotProps>>;
      }
    : T;
