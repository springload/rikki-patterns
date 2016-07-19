import React from 'react';


const TweetProvider = React.createClass({
    getInitialState() {
        return {
            hasError: false,
            tries: 0,
            maxTries: this.props.service.MAX_RETRIES,
            tweets: [],
        }
    },

    componentDidMount() {
        this.fetchTweets();
    },

    fetchTweets() {
        const {config} = this.props;

        this.setState({
            loading: true
        }, () => {
            this.props.service.fetch(this.handleLoad, this.handleError);
        });
    },

    handleLoad(json) {
        this.setState({
            tweets: json,
            loading: false,
        });
    },

    handleError(e) {
        const {tries, maxTries} = this.state;
        this.setState({
            hasError: true,
            loading: false,
            tries: tries + 1
        }, () => {
            if (tries < maxTries) {
                setTimeout(this.fetchTweets, this.props.service.RETRY_TIME);
            }
        })
    },

    render() {
        const {loading, hasError, tweets} = this.state;
        let children = React.cloneElement(this.props.children, {
            loading, hasError, tweets,
        });
        return <div>{children}</div>
    }
});

export default TweetProvider;

