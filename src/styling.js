import {setCSS} from "./utils";

export function styleButton(buttons){
    buttons.forEach(node => {
        setCSS(node, {
            backgroundColor: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            margin: 0,
            fontSize: '12px',
            width: 'auto',
            minWidth: 'unset'
        });
    });
}