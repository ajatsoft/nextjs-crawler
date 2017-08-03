import React from 'react';
import cheerio from 'cheerio';
import superagent from 'superagent';


export default class extends React.Component {
  render() {
    const { results } = this.props.url.query;
    console.log(results);
    return <div>
      { results.map(item => (<div>
        <a href={item.href}>{item.title}</a>
      </div>)) }
    </div>
  }
}
