import React from 'react';
import './style.css';
import classnames from 'classnames';

export const MultiRangeSlider: React.FC<{
    onParentSubmit: ([min, max]: [number, number]) => void;
}> = ({ onParentSubmit }) => {
    const [min, setMin] = React.useState<number>(18);
    const [max, setMax] = React.useState<number>(60);

    const minRef = React.useRef<HTMLInputElement>(null);
    const maxRef = React.useRef<HTMLInputElement>(null);
    const range = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        onParentSubmit([min, max]);
    }, [min, max, onParentSubmit]);

    const getPercent = React.useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max],
    );

    React.useEffect(() => {
        if (maxRef.current) {
            const minPercent = getPercent(min);
            const maxPercent = getPercent(+maxRef.current.value);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [min, getPercent]);

    React.useEffect(() => {
        if (minRef.current) {
            const minPercent = getPercent(+minRef.current.value);
            const maxPercent = getPercent(max);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [max, getPercent]);

    return (
        <>
            <input
                type='range'
                min={18}
                max={59}
                value={min}
                ref={minRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = Math.min(+event.target.value, max - 1);
                    setMin(value);
                    event.target.value = value.toString();
                }}
                className={classnames('thumb thumb--zindex-3', {
                    'thumb--zindex-5': min > max - 100,
                })}
            />
            <input
                type='range'
                min={19}
                max={60}
                value={max}
                ref={maxRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const value = Math.max(+event.target.value, min + 1);
                    setMax(value);
                    event.target.value = value.toString();
                }}
                className='thumb thumb--zindex-4'
            />

            <div className='slider'>
                <div className='slider__track'></div>
                <div ref={range} className='slider__range'></div>
                <div className='slider__left-value'>{min}</div>
                <div className='slider__right-value'>{max}</div>
            </div>
        </>
    );
};

export default MultiRangeSlider;
