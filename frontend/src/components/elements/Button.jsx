import clsx from "clsx";

function getClassName({ className }) {
    return clsx(
        'text-black text-lg font-bold transition-duration-300 cursor-pointer rounded',
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
    gray: 'bg-gray-200 text-gray-500 hover:bg-gray-300',
    green: 'bg-green-500 text-white hover:bg-green-600 focus:bg-green-600',
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