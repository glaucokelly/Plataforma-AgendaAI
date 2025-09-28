import React from "react";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>
                    &copy; {new Date().getFullYear()} Sistema de Gerenciamento de Agendamentos. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
