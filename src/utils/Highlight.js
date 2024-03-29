import React from 'react';
import PropTypes from 'prop-types';

import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

const registeredLanguages = {};

class Highlight extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false };
    this.codeNode = React.createRef();
  }

  componentDidMount() {
    const { language } = this.props;

    if (language && !registeredLanguages[language]) {
      try {
        const newLanguage = require(`../../node_modules/highlight.js/lib/languages/${language}`);
        hljs.registerLanguage(language, newLanguage);
        registeredLanguages[language] = true;

        this.setState({ loaded: true }, this.highlight);
      } catch (e) {
        console.error(e);
        throw Error(`Cannot register the language ${language}.`);
      }
    } else {
      this.setState({ loaded: true });
    }
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    this.codeNode &&
      this.codeNode.current &&
      hljs.highlightElement(this.codeNode.current);
  };

  render() {
    const { children, className, language } = this.props;
    const { loaded } = this.state;

    if (!loaded) {
      return null;
    }

    return (
      <pre className={className} style={{ whiteSpace: 'pre-wrap' }}>
        <code ref={this.codeNode} className={language}>
          {children}
        </code>
      </pre>
    );
  }
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  language: PropTypes.string
};

Highlight.defaultProps = {
  language: 'json'
};

export default Highlight;
