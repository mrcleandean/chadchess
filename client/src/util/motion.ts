const titleVariant = (delay?: number) => {
    return {
        hidden: {
            y: -50,
            opacity: 0
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                duration: 1.25,
                delay: delay
            }
        }
    }
}

const staggerVariant = (sc?: number, dc?: number) => {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: sc,
                delayChildren: dc
            }
        }
    }
}

const fadeIn = (direction?: string, type?: string, delay?: number, duration?: number) => {
    return {
        hidden: {
            x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
            y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
            opacity: 0,
        },
        show: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: "easeOut",
            },
        },
    };
}

const slideIn = (direction?: string, type?: string, delay?: number, duration?: number) => {
    return {
        hidden: {
            x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
            y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
        },
        show: {
            x: 0,
            y: 0,
            transition: {
                type: type,
                delay: delay,
                duration: duration,
                ease: "easeOut",
            },
        },
    };
};

export { titleVariant, staggerVariant, fadeIn, slideIn }