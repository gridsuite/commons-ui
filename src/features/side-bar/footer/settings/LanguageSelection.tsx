import { Done } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { GsLang } from '../../../../utils';
import { CustomMenuItem } from '../../../../components';

interface LanguageSelectionProps {
    language: GsLang;
    isSelectedLanguage: boolean;
    setSelectedLanguage: (newLanguage: GsLang) => Promise<void>;
}
export function LanguageSelection({
    language,
    isSelectedLanguage,
    setSelectedLanguage,
}: Readonly<LanguageSelectionProps>) {
    const onClick = () => {
        setSelectedLanguage(language) // TODO: improve error handling
            .catch((err) => console.error(err));
    };

    return (
        <CustomMenuItem sx={{ px: 2 }} onClick={onClick}>
            <FormattedMessage id={`top-bar/language/${language}`} />
            <Done color="info" sx={{ ml: 1, visibility: isSelectedLanguage ? 'initial' : 'hidden' }} />
        </CustomMenuItem>
    );
}
