import React, { ElementType, forwardRef, useCallback } from "react";
import classNames from "classnames";
import { Typography } from "~/components";
import styles from "./Input.module.scss";
import InputMask from 'react-input-mask'
import { getRuGenitiveCaseDayAndMonth } from "~/helpers/getRuGenitiveCaseDayAndMonth";


type Props = {
    className?: string;
    type?: string;
    label: string;
    onChange: (value: any) => void;
    value?: any;
    theme?: 'default' | 'transparent';
    width?: 'small' | 'smaller' | 'medium' | 'big' | 'bigger';
}  & (
    {
        isWithEvent?: false;
    } | {
        isWithEvent: true;
        icon: string;
        buttonLabel?: string;
        eventAction: () => void;
    } | {
        isWithEvent: true;
        icon?: string;
        buttonLabel: string;
        eventAction: () => void;
    }
  ) 

const Input = forwardRef<HTMLInputElement, Props>(
    ({ className, 
        label, 
        onChange,
        width,
        type,
        theme,
        ...props 
    }, forwardedRef) => {

        const {
            isWithEvent,
            icon,
            buttonLabel, 
            eventAction,
        } = {
            isWithEvent: undefined,
            icon: undefined,
            buttonLabel: undefined,
            eventAction: undefined,
            ...props,
        };

        const IconComponent = (icon as ElementType) ?? <span />;

        const onButtonClick = useCallback(()=>{
            if(eventAction) eventAction();
        }, [eventAction])

        let input = (
            <input 
                ref={ forwardedRef } 
                className={classNames(styles.htmlInput, theme === 'transparent' ? styles.htmlInputTransparent : undefined)}
                onChange={ (input) => onChange(input.target.value) }
                { ...props }
                type={type}
            />
        )
        
        if(type === 'phone'){
            input = (
                <InputMask
                    ref={ forwardedRef }
                    alwaysShowMask
                    className={ classNames(styles.htmlInput, theme === 'transparent' ? styles.htmlInputTransparent : undefined) }
                    formatChars={{
                        '*': '[0-9]',
                    }}
                    mask="+7 (***) *** - ** - **"
                    maskChar="_"
                    { ...props }
                />
            )
        }

        if(type === 'date'){
            input = 
            (
                <>
                    <input 
                    ref={ forwardedRef } 
                    className={classNames(styles.htmlInput, theme === 'transparent' ? styles.htmlInputTransparent : undefined)}
                    onChange={ (input) => onChange(input.target.value) }
                    { ...props }
                    type={type}
                    />
                    <div className={classNames(styles.htmlInputText, theme === 'transparent' ? styles.htmlInputTransparent : undefined)} > 
                        {getRuGenitiveCaseDayAndMonth(props.value)} 
                    </div> 
                </>
            )
        }


        return (
            <div className={classNames(styles.input, theme === 'transparent' ? styles.inputTransparent : undefined, width ? styles[width] : undefined, className)}>
                <div className={styles.inputBlock}>
                    <Typography className={classNames(styles.inputLabel, theme === 'transparent' ? styles.inputLabelTransparent : undefined)}>{label}</Typography>
                    {input}
                </div>
                {isWithEvent !== undefined ? (
                    <button className={styles.button} onClick={onButtonClick}>
                        {!!icon && <span className={ styles.icon }><IconComponent /></span>}
                        {!!buttonLabel && <span>{buttonLabel}</span>}
                    </button>
                ) : null}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
