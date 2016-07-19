import React from 'react';

const {{ data.jsName }} = React.createClass({
    render() {
        return (
            <div className="{{ data.className }}">
                {{ data.humanName }}
            </div>
        )
    }
})

export default {{ data.jsName }};
