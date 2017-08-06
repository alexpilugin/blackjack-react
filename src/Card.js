import React, { Component } from 'react';
import './styles/Card.css';

class Card extends Component {

  clickHandler = () => {
    if (this.props.data && this.props.click) {
      this.props.click(this.props.data);
    }
  }

  render() {
    var cardStyle = {
      backgroundPosition: `-${157.52 * this.props.data.spriteNum}px 0px`
    };
    let value = this.props.data.value;
    let clickableCard = (value === 1 || value === 11) ? "clickable Card" : "Card";
    return (
      <div
        className={clickableCard}
        style={cardStyle}
        onClick={this.clickHandler}>
      </div>
    )
  }
}

export default Card;