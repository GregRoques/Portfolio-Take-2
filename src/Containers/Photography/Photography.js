import React, { Component } from 'react';
import css from './Photography.module.css'
import { connect } from "react-redux";
import SetHeader from '../../Actions/SetHeader';
import { SetPhotoArray } from '../../Actions/PhotoArray';
import PhotoGallery from './GalleryHandler';
import InstaGallery from './instaGallery';

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
        if (window.location.pathname === "/photography/"){
          this.props.history.push(`/photography`)
        }
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
                {/* <h1 className = {css.albumTitleText}>Music + Travel</h1> */}
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
                  </div>
                  
                  <div className={css.publishedWorkButtonAlign}>
                      <span><a target="_self" rel="noopener noreferrer" href='https://www.gregroques.com/media'>
                          <button className={css.publishedWorkButton}>Published Work</button>
                      </a></span>
                  </div>
                  <InstaGallery/>
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