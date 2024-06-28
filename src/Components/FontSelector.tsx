

export default function FontSelector(props: { defaultValue: string, onChange: (e: any) => void }) {
    return (
        <select defaultValue={props.defaultValue}
                onChange={props.onChange}>
            <option value={"font-MontserratItalic"}>Montserrat Italic</option>
            <option value={"font-PlaywriteITModerna"}>Playwrite ITModerna</option>
            <option value={"font-RobotoBlack"}>Roboto Black</option>
        </select>
    );
}