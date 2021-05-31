const Footer = () => {
    /* eslint jsx-a11y/anchor-has-content: "off" */
    return (
        <footer className="footer">
            <div>Follow me!</div>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/lukaboljevic"
                className="fa fa-github"
            ></a>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://www.instagram.com/lukab99/"
                className="fa fa-instagram"
            ></a>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://www.facebook.com/lukab99/"
                className="fa fa-facebook"
            ></a>
            <a
                target="_blank"
                rel="noreferrer"
                href="mailto:lukaboljevic.boljevic@gmail.com"
                className="fa fa-envelope-square"
            ></a>
        </footer>
    );
};

export default Footer;
