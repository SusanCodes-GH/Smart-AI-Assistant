import React from 'react'

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                "display": "inline-flex",
                "align-items": "center",
                "background": "#21c17a",
                "color": "white",
                "border": "none",
                "padding": "10px 16px",
                "gap": "5px",
                "border-radius": "15px",
                "cursor": "pointer",
                "font-weight": "500",
            }}
        >
            {children}
        </button>
    )
}

export default Button