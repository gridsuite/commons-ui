/*
 * Copyright © 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { MessageDescriptor } from 'react-intl';

type MsgDescriptor<ID extends string /* MessageIds */ = string> = Omit<MessageDescriptor, 'id' | 'defaultMessage'> & {
    id?: ID;
    defaultMessage: string;
};
type Translations<ID extends string> = {
    [K in ID]: MsgDescriptor<K>;
};

/**
 * Simple mapper for IntlProvider and serve as hook for eslint-plugin-formatjs which need {@link MessageDescriptor} to work.
 * @param msgs the messages
 * @see {@link import('react-intl').defineMessages defineMessages}
 * @todo replace by babel-plugin-formatjs or @formatjs/ts-transformer
 */
export function defineTranslations<ID extends string>(msgs: Translations<ID>): Record<ID, string> {
    return (Object.entries<MsgDescriptor<ID>>(msgs) as Array<[ID, MsgDescriptor<ID>]>).reduce((acc, [id, msgDescr]) => {
        acc[id] = msgDescr.defaultMessage;
        return acc;
    }, {} as Record<ID, string>);
}

// TODO: found how to use shared settings, https://formatjs.github.io/docs/tooling/linter/#formatjsadditionalfunctionnames
export const defineMessages = defineTranslations;
