import React from 'react';
import ReactReplaceCSSTransitionGroup from 'react-css-transition-replace';

import Tweet from './tweet';

const DURATION = 10000;


const Tweets = React.createClass({
    getInitialState() {
        const {config} = this.props;
        const numTweets = parseInt(config.numTweets, 10);
        const duration = config.duration ? parseInt(config.duration, 10) : DURATION;

        return {
            offset: 0,
            itemsPerPage: numTweets,
            duration: duration
        }
    },

    componentDidMount() {
        const {config} = this.props;
        if (config.autoAdvance) {
            if (this.interval) {
                clearInterval(this.interval);
            }

            this.interval = setInterval(() => {
                this.setState({
                    hasError: false,
                    loading: false,
                    offset: this.getOffset()
                })
            }, this.state.duration);
        }
    },

    getOffset() {
        let {tweets} = this.props;
        let {offset, itemsPerPage} = this.state;
        let startIndex = offset * itemsPerPage;

        if (startIndex >= tweets.length - itemsPerPage) {
            offset  = 0;
        } else {
            offset = offset + 1
        }

        return offset;
    },

    getTweets() {
        let {tweets} = this.props;
        let {offset, itemsPerPage} = this.state;
        let page = this.getOffset();
        let startIndex = page * itemsPerPage;
        let endIndex = startIndex + itemsPerPage
        return tweets.slice(startIndex, endIndex);
    },

    render() {
        const {hasError, loading} = this.props;
        const {itemsPerPage} = this.state;
        const tweetItems = this.getTweets();
        const children = tweetItems.map(data => {
            return  <Tweet tweet={data} key={data.tweet_id} />
        });

        let containers = [];

        for (let i = 0; i < itemsPerPage; i++) {
            let delay = `tweet-delay-${i}`;

            containers.push(
                <ReactReplaceCSSTransitionGroup
                    key={i}
                    component="div"
                    className={`tweet__wrapper ${delay}`}
                    transitionName="tweet"
                    transitionEnterTimeout={1100}
                    transitionLeaveTimeout={500}>
                    {children.length ? children[i] : null}
                </ReactReplaceCSSTransitionGroup>
            );
        }

        return (
            <div className="tweets">
                {containers}
            </div>
        );
    }
});


export default Tweets;
