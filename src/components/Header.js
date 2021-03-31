import PropTypes from 'prop-types'
import Button from './Button'

const Header = ({ title }) => {
    return (
        <header className='header'>
            <h1>{ title }</h1>
            <Button color='green' text='Add' />
        </header>
    )
}

Header.defaultProps = {
    title: 'Task Tracker'
}

// defines title property type and makes it required
Header.propTypes = {
    title: PropTypes.string.isRequired
}

export default Header
