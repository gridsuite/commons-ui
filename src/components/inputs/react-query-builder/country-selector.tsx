import {
    FullOption,
    OptionGroup,
    ValueSelectorProps,
} from 'react-querybuilder';
import { MenuItem, Select } from '@mui/material';

/**
 * ValueSelector which allows to have a few "favorite" countries always displayed
 * at the beginning of the selector and separated from the others options
 */
function CountrySelector(props: ValueSelectorProps) {
    const { options, value, handleOnChange } = props;
    let favs: FullOption<string>[] | OptionGroup<FullOption<string>>[] = [];
    let allOthers: FullOption<string>[] | OptionGroup<FullOption<string>>[] =
        [];
    options.forEach((opt: any) => {
        if (opt.fav) {
            favs = [...favs, opt];
        } else {
            allOthers = [...allOthers, opt];
        }
    });

    return (
        <Select
            value={value !== undefined ? value : ''}
            onChange={(e) => handleOnChange(e.target.value)}
        >
            {favs.map((opt: any) => (
                <MenuItem key={opt.name} value={opt.name}>
                    {opt.label}
                </MenuItem>
            ))}
            {favs.length > 0 ? <option disabled>──────────</option> : ''}
            {allOthers.map((opt: any) => (
                <MenuItem key={opt.name} value={opt.name}>
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    );
}

export default CountrySelector;
