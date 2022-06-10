import React from 'react';
import moment from 'moment';
import AccessTimeRoundedIcon from '@material-ui/icons/AccessTimeRounded';

interface IProps {
    className?: string;
    style?: React.CSSProperties;
    passInTime: Date;
}

export const CountDownTimer: React.FC<IProps> = (props: IProps) => {
    const [time, setTime] = React.useState(
        moment(props.passInTime).diff(moment(), 'seconds'),
    );

    const onTick = React.useCallback(() => {
        setTime(moment(props.passInTime).diff(moment(), 'seconds'));
    }, [props.passInTime]);

    React.useEffect(() => {
        const timer = setInterval(onTick, 1000);
        return () => clearInterval(timer);
    }, [onTick]);

    return (
        <div className={props.className ?? ''} style={props.style}>
            <span>
                <AccessTimeRoundedIcon />
            </span>
            <h1>
                {moment
                    .duration(time, 'seconds')
                    .asHours()
                    .toString()
                    .substring(0, 2)}
                : {moment.duration(time, 'seconds').minutes()} :{' '}
                {moment.duration(time, 'seconds').seconds()}
            </h1>
        </div>
    );
};

export default CountDownTimer;
