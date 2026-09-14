/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Done } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { GsLang } from '../../../../utils';
import { CustomMenuItem } from '../../../../components';
import { submenuFooterStyle } from '../common/submenu-footer.style';

interface LanguageSelectionProps {
    language: GsLang;
    isSelectedLanguage: boolean;
    setSelectedLanguage: (newLanguage: GsLang) => void;
}
export function LanguageSelection({
    language,
    isSelectedLanguage,
    setSelectedLanguage,
}: Readonly<LanguageSelectionProps>) {
    const onClick = () => {
        setSelectedLanguage(language);
    };

    return (
        <CustomMenuItem sx={submenuFooterStyle.subMenuChildren} onClick={onClick}>
            <FormattedMessage id={`top-bar/language/${language}`} />
            <Done color="info" sx={{ ml: 1, visibility: isSelectedLanguage ? 'initial' : 'hidden' }} />
        </CustomMenuItem>
    );
}
