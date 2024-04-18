import clsx from "clsx";

function getClassName({ className }) {
    return clsx(
        'text-black text-lg font-bold transition-duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded',
        className
    )
}

const sizes = {
    tiny: 'px-2',
    small: 'px-4 py-3',
    medium: 'px-6 py-4',
    large: 'w-full px-4 py-3'
}

const variants = {
    red: 'bg-red-500 text-gray-100 hover:bg-red-600',
    blue: 'bg-blue-500 text-gray-100 hover:bg-blue-600',
    gray: 'bg-gray-400 text-gray-100 hover:bg-gray-500',
    green: 'bg-green-500 hover:bg-green-400',
}

const Button = ({
    children,
    className,
    size = 'small',
    variant = 'primary',
    ...rest
}) => {
    return (
        <button className={clsx(
            sizes[size],
            variants[variant],
            getClassName({ className })
        )}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button;