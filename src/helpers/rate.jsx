export const createAverageRate = (index, rate, width = "30px", height = "30px") => {
    const fullFill = rate >= index;
    const partialFill = rate > index - 1 && rate < index;
    const fillPercentage = partialFill ? (rate % 1) * 100 : 0;

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={index}
        >
            <defs>
                <linearGradient
                    id={`grad-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset={`${fillPercentage}%`} stopColor="#cd3f34" />
                    <stop offset={`${fillPercentage}%`} stopColor="#597e6a" />
                </linearGradient>
            </defs>

            <path
                d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                fill={
                    fullFill
                        ? "#cd3f34"
                        : partialFill
                            ? `url(#grad-${index})`
                            : "#597e6a"
                }
            ></path>
        </svg>
    );
};