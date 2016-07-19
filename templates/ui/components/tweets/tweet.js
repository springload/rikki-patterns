import React from 'react';


function formatTweetText(text) {
    return text.replace(/\n/g, '')
}


const Tweet = (props) => {
    const {tweet} = props;
    let url = `https://twitter.com/${tweet.screen_name}/status/${tweet.id}`;

    return (
        <div className="tweet">
            <div className="tweet__body">
                <p>
                    {formatTweetText(tweet.text)}
                </p>
            </div>
            <cite className="tweet__cite">
                <span className="tweet__cite__author">{tweet.user} – </span>
                <a href={url}>
                    <span className="tweet__cite__username">{tweet.screen_name}</span>
                </a>
            </cite>
        </div>
    );
}

export default Tweet;

