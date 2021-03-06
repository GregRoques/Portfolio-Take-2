import React, { Component } from 'react';
import { connect } from 'react-redux';

// css
import entriesCSS from './entries.module.css'

// components
import ArchiveModal from './archiveModal'
import InstaModal from './instaModal'

// actions
import SetHeader from '../../Actions/SetHeader'
import { logOut } from '../../Actions/Auth'

// backend
import { write, read, kanye } from '../../AxiosOrders'

// =================================================================
// Get Today's Date

var todaysDate = new Date()
var day = ((todaysDate.getDate()).toString()).replace(/^0+/, '')
var month = ((todaysDate.getMonth()+1).toString()).replace(/^0+/, '')
var year = todaysDate.getFullYear()

var todayReadableDate = month + "–" + day + "–" + year

// =================================================================
class Entries extends Component{

    componentDidMount() {
        this.props.Header("Welcome, Greg");
        window.scrollTo(0, 0);
       
        //Past Articles
        read.get()
        .then(response=>{
            const blogReturn = Object.values(response.data.users)[0];
            const instaAccess = response.data.insta_access.lttDate;
            const instaName = response.data.insta_access.userName
            if(instaAccess){
                this.instaUpdateDate(instaAccess, instaName)
            }
            this.setState({
                entries: blogReturn,
            })
        })
        .catch(error=> {
            console.log(error);
        })

          //Inspirational quote to keep me motivated
          kanye.get()
          .then(response=>{
              this.setState({
                  textPlaceholder: `Kanye Quote of the Day: "${response.data.quote}"`
              })        
          })
      
          .catch(error=> {
              console.log('Did the Earth stop rotating? Kanye is quiet... ', error)
          })

    }

    state={
        //Article Data
            title:'',
            date: todayReadableDate,
            text:'',
        //Article Placeholder
            titlePlaceholder: 'Title',
            datePlaceholder: todayReadableDate,
            textPlaceholder: "Text",
        //Loading Previous Entries
            newEntry: false,
            entries:'',
            updateArticleKey:'',
        //Insta Logout
            instaLogOut: 0,
            instaIsOpen: false,
            instaName: ""
    }

// =================================================================
//Insta Update Date

    instaUpdateDate = (ex, name) => {
        let numOfDays
        if(ex !== this.state.instaLogOut){
            const days = 59;
            let result = new Date(ex);
            let today = new Date();
            result.setDate(result.getDate() + days);
            const numOfSeconds = result.getTime() - today.getTime();
            numOfDays = (Math.round(numOfSeconds) / (1000 * 3600 * 24)).toFixed(1);
            //console.log(numOfSeconds + " | " + numOfDays)
        } else {
            numOfDays = ex
        }
        this.setState({
            instaLogOut: numOfDays,
            instaName: name

        })
    }


// =================================================================
// Tile, Date, and Text Date Listeners

    titleChangedHandler = (e) =>{
        if (this.props.Header !== "Welcome, Greg"){
            this.props.Header("Welcome, Greg")
        }
        this.setState({
            title: e.target.value
        })
    }

    dateChangedHandler = (e) =>{
        if (this.props.Header !== "Welcome, Greg"){
            this.props.Header("Welcome, Greg")
        }
        this.setState({
            date: e.target.value
        })
    }

    textChangedHandler = (e) =>{
        if (this.props.Header !== "Welcome, Greg"){
            this.props.Header("Welcome, Greg")
        }
        this.setState({
            text: e.target.value
        })
    }

    submitHandler = e =>{
        e.preventDefault();
        const myArticle = {
            title: this.state.title,
            date: this.state.date,
            text: this.state.text
        }

        if(myArticle.title && myArticle.date && myArticle.text){
            if(this.state.updateArticleKey && this.state.entries[this.state.updateArticleKey].date === this.state.date){
                write.patch(`${this.props.userId}/${this.state.updateArticleKey}/.json?auth=${this.props.idToken}`, myArticle)
                .then(response=>{
                    this.props.Header('Post Successful');

                    read.get()
                    .then(response=>{
                        const blogReturn = Object.values(response.data.users)[0]
                        this.setState({
                            entries: blogReturn,
                            updateArticleKey: '',
                            title: '',
                            date: '',
                            text: ''                        
                        })
                    })
                    .catch(error=> {
                        console.log('Could Not Load Saved Blog Articles.');
                    })
                })
                    .catch(error=>{ 
                        this.props.Header('Post Error');
                        console.log(error)
                })
                
            } else{
                write.post(`${this.props.userId}.json?auth=${this.props.idToken}`, myArticle)
                    .then(response=>{
                        this.props.Header('Post Successful');
                    
                        read.get()
                        .then(response=>{
                            const blogReturn = Object.values(response.data.users)[0]
                            this.setState({
                                entries: blogReturn,
                                updateArticleKey: '',
                                title: '',
                                date: '',
                                text: ''
                            })
                        })
                        .catch(error=> {
                            console.log('Could Not Load Saved Blog Articles.');
                        })
                    })
                .catch(error=>{ 
                    this.props.Header('Post Error');
                    console.log(error)
                })
            }
        }else{
           if (!myArticle.text){
               this.setState({
                   textPlaceholder: 'You Must Fill In Every Field'
               })
           }
           if (!myArticle.date){
                this.setState({
                    datePlaceholder: 'You Must Fill In Every Field'
                })
            }
            if (!myArticle.title){
                this.setState({
                    titlePlaceholder: 'You Must Fill In Every Field'
                })
            }
        }
    }

    updateHandler = updateInfo =>{
        this.setState({
            title: this.state.entries[updateInfo].title,
            date: this.state.entries[updateInfo].date,
            text: this.state.entries[updateInfo].text,
            updateArticleKey: updateInfo,
            newEntry: false
        })
    }

    deleteHandler = articleToDelete =>{
        write.delete(`${this.props.userId}/${articleToDelete}/.json?auth=${this.props.idToken}`)
        .then(response=>{
            this.props.Header('Delete Successful');
            
            read.get()
                .then(response=>{
                    const blogReturn = Object.values(response.data.users)[0]
                    this.setState({
                        entries: blogReturn,
                        updateArticleKey:''
                    })
                })
                .catch(error=> {
                    console.log('Could Not Load Saved Blog Articles.');
                })
        })
        .catch(error=>{ 
            this.props.Header('Delete Error');
            console.log(error)
        })
    }

    // =================================================================
    // Archive Modal

    openModal = () =>{
        if(!this.state.instaIsOpen){
            if(!this.state.entries){
                this.props.Header("Error");
            }else{
                this.setState({
                    newEntry: true
                })
            }
        }
    }

    instaUpdate = () =>{
        if(!this.state.newEntry){
            this.setState({
                instaIsOpen: true
            })
        }
    }

    closeModal = () =>{
        const isInstaOpen = this.state.instaIsOpen;
        this.setState({
            [isInstaOpen ? 'instaIsOpen' : 'newEntry']: false
        })
    }

    render(){
        return(
            <div>
                <ArchiveModal 
                    articles={this.state.entries} 
                    show={this.state.newEntry} 
                    updateArticle={this.updateHandler}
                    existingDelete={this.deleteHandler} 
                    closed={this.closeModal}
                />
                <InstaModal
                    expirationDate={this.state.instaLogOut}
                    userName={this.state.instaName}
                    databaseID={this.props.userId}
                    databaseToken={this.props.idToken}
                    updateInsta={this.instaUpdateDate}
                    show={this.state.instaIsOpen} 
                    closed={this.closeModal}
                />
                <div className={entriesCSS.logOutTime}>
                    You will be logged out at <b>{localStorage.getItem('logOutTime')}</b>
                </div>
                {this.state.instaLogOut > 0 ?
                    <div className={entriesCSS.logOutTime}>
                        Instagram token will expire in <b>{this.state.instaLogOut} days.</b>
                    </div>
                    : null
                }
                <div className={entriesCSS.posts}>
                    <input 
                        type="text" 
                        maxLength="50"
                        placeholder={this.state.titlePlaceholder}
                        onChange={this.titleChangedHandler}
                        value={this.state.title}
                    />
                    <br/>
                    <input 
                        type="text" 
                        placeholder={this.state.datePlaceholder}
                        maxLength="10"
                        onChange={this.dateChangedHandler}
                        value={this.state.date}
                    />
                    <br/>
                    <textarea
                        rows="20"
                        type="text"
                        maxLength="5000" 
                        placeholder={this.state.textPlaceholder}
                        onChange={this.textChangedHandler}
                        value={this.state.text}
                    />
                </div>
                <div className={entriesCSS.buttonPosition}>
                    <button className={entriesCSS.publishButtons} onClick={!this.state.instaIsOpen ? (e)=> this.submitHandler(e): null}>Submit</button>
                    <button className={entriesCSS.publishButtons} onClick={()=> this.openModal()}>Update Existing</button>
                </div>
                <div className={entriesCSS.buttonPosition}>
                    <button className={entriesCSS.publishButtons} onClick={()=>this.props.LogOut()}>Log Out</button>
                    <button className={entriesCSS.publishButtons} onClick={()=>this.instaUpdate()}>Instagram</button>
                </div>
            </div>
            
        )

    }
}


const mapStateToProps = state =>{
    return{
        userId: state.auth.userId,
        idToken: state.auth.idToken
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        Header: (page) => dispatch(SetHeader(page)),
        LogOut: () => dispatch(logOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Entries);