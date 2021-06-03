export const dropdownOptions = [
    { value: "name ascending", label: "By name (asc.)" },
    { value: "name descending", label: "By name (desc.)" },
    { value: "hourPrice ascending", label: "By price (asc.)" },
    { value: "hourPrice descending", label: "By price (desc.)" },
    { value: "city ascending", label: "By city (asc.)" },
    { value: "city descending", label: "By city (desc.)" },
    { value: "createdAt ascending", label: "Publish date (asc.)" },
    { value: "createdAt descending", label: "Publish date (desc.)" },
];

export const dropdownStyles = {
    // Container
    container: (provided, state) => ({
        ...provided,
        width: "220px",
    }),
    // The select itself I believe
    control: (provided, state) => ({
        ...provided,
        border: "2px solid black",
        borderRadius: "6px",
        boxShadow: "none",
        height: "30px",
        ":hover": {
            borderColor: "var(--darker-gray)",
            transition: "none",
        },
    }),
    // The vertical black line separating the text and the arrow
    indicatorSeparator: (provided, state) => ({
        ...provided,
        backgroundColor: "black",
    }),
    // The arrow
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: "black",
    }),
    // The container for the values (i.e. the text inside the select)
    valueContainer: (provided, state) => ({
        ...provided,
        marginBottom: "2px",
        fontSize: "1.1em",
    }),
    // The dropdown menu itself
    menu: (provided, state) => ({
        ...provided,
        border: "1px solid black",
        borderRadius: "6px",
    }),
    // Options when the menu is open
    option: (provided, state) => ({
        ...provided,
        // if it's selected, then it's lighter blue, else it's the default color
        backgroundColor: state.isSelected
            ? "var(--lighter-blue)"
            : provided.backgroundColor,
        // when we hover over an option
        ":hover": {
            backgroundColor: state.isSelected
                ? "var(--lighter-blue)"
                : "var(--lighter-gray)",
        },
    }),
};
