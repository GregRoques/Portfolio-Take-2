import React, { Component } from 'react';
import css from './Photography.module.css'

var myInterval

class PhotoGallery extends Component{
    state = {
        currentImage: 0
      }
    
    maskOn = gallery => {
    myInterval =  setInterval(() => {
            if (this.state.currentImage < gallery.length - 1){
                this.setState({
                currentImage: this.state.currentImage +1
                })
            }else{
                this.setState({
                currentImage: 0
                })
            }
            
        }, 800);
    }
    
    maskOff = () => {
        clearInterval(myInterval)
      this.setState({
        currentImage: 0
      })
    }

    render(){

    return(
      <div className= { css.centerText }>
        <img 
          className = { css.box }
          src = { './images/photography/'+ this.props.images[this.props.album][this.state.currentImage]}
          alt = { this.props.album }
          onMouseEnter = {()=> this.maskOn(Object.values(this.props.images[this.props.album]))}
          onMouseLeave ={()=> this.maskOff()}
          onClick ={()=> this.props.selectAlbumHandler(this.props.album)}
        />
        { this.props.album }
      </div>
    )
    }
  }

  export default PhotoGallery;

  