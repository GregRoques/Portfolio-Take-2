import React, { Component } from 'react';
import css from './Photography.module.css'
import { connect } from "react-redux";
import SetHeader from '../../Actions/SetHeader'
import { SetPhotoArray } from '../../Actions/PhotoArray'
import PhotoGallery from './GalleryHandler'

var photoArray ={}

class Photography extends Component{

    componentDidMount() {
        this.props.Header("Photography");
        window.scrollTo(0, 0);
    }

      selectAlbum = extension => {

        const urlExtension = extension.replace(/[" "]/g, "_")
        this.props.history.push(`/photography/${urlExtension}`)
        }
    
      render(){
        if(this.props.reduxPhoto === null){
            const folderNames = require.context('../../../public/images/photography/').keys()
            folderNames.forEach(folder=>{
              let anImage = folder
              let anAlbum = (folder.replace('./','')).split('/')[0]
                
              if (!Object.keys(photoArray).includes(anAlbum)){
                photoArray[anAlbum] = [anImage]
              } else {
                photoArray[anAlbum].push(anImage)
              }
            })
            this.props.setArray(photoArray)
        } else {
          photoArray = this.props.reduxPhoto
        }
       
          return(
              <div className = { css.fadeIn }>
                  <div className = { css.galleryContainer }>
                      <div className = { css.gridContainer }>
                            {Object.keys(photoArray).map((volume, i) => {
                                return(
                                  <PhotoGallery
                                    key= { i }
                                    album= { volume }
                                    images= { photoArray }
                                    selectAlbumHandler = {this.selectAlbum}
                                  />
                                )
                            })}
                      </div>
                      <div className = { css.socialIcon}>
                            <span>
                                <a rel="noopener noreferrer" target="_blank" href="https://www.instagram.com/qtrmileatatime/">
                                    <img alt="Instagram @QtrMileAtATime" src="images/socialIcons/instagram.png"/> @qtrmileatatime
                                </a>                            
                            </span>
                        </div>
                  </div>
              </div>
          )
        
      }
    }

const mapStateToProps = ({reduxPhoto}) =>{
  return {
    reduxPhoto: reduxPhoto.reduxPhoto
}
}

const mapDispatchToProps = dispatch =>{
    return{
         Header: page => dispatch(SetHeader(page)),
         setArray: array => dispatch(SetPhotoArray(array))
    }
 }

export default (connect)(mapStateToProps, mapDispatchToProps)(Photography);