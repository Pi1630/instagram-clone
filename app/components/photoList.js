import React from 'react'
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image} from 'react-native'
import {f, auth, database, storage} from '../../config/config.js'

export default class PhotoList extends React.Component {

    constructor(props){
        super(props)
        this.state={
            photo_feed: [],
            refresh: false,
            loading: true
        }
    }

    componentDidMount = () => {
        const { isUser, userId } = this.props;

        if (isUser == true){
            //Profile, userId
            this.loadFeed(userId)
        }else{
            this.loadFeed('')
        }


    }
    pluralCheck = (s) => {
        if (s == 1) {
            return ' ago';
        } else {
            return 's ago'
        }
    }

    timeConverter = (timestamp) => {
        var a = new Date(timestamp * 1000)
        var seconds = Math.floor((new Date() - a) / 1000)

        var interval = Math.floor(seconds / 31536000)
        if (interval > 1) {
            return interval + ' year' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 2592000)
        if (interval > 1) {
            return interval + ' month' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 86400)
        if (interval > 1) {
            return interval + ' day' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 3600)
        if (interval > 1) {
            return interval + ' hour' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 60)
        if (interval > 1) {
            return interval + ' minute' + this.pluralCheck(interval)
        }

        return Math.floor(seconds) + ' second' + this.pluralCheck(seconds)
    }

    addToFlatList = (photo_feed, data, photo) => {
        var that = this;
        var photoObj = data[photo]
        database.ref('users').child(photoObj.author).child('username').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null)
            console.log('exists = ' , exists)
            if (exists) data = snapshot.val();
            photo_feed.push({
                id: photo,
                url: photoObj.url,
                caption: photoObj.caption,
                posted: that.timeConverter(photoObj.posted),
                author: data,
                authorId: photoObj.author
            })

            that.setState({
                refresh: false,
                loading: false
            })
        }).catch(error => console.log(error))
    }


    loadFeed = (userId = '') => {
        this.setState({
            refresh: true,
            photo_feed: []
        })
        var that = this;

        var loadRef = database.ref('photos')
        if (userId != ''){
            loadRef = database.ref('users').child(userId).child('photos')
        }

        loadRef.orderByChild('posted').once('value').then(function (snapshot) {
            const exists = (snapshot.val() !== null)
            if (exists) data = snapshot.val();
            var photo_feed = that.state.photo_feed
            console.log('data - ' , data)
            for (var photo in data) {
                console.log('photo - ' , photo)
                that.addToFlatList(photo_feed, data, photo)
            }
        }).catch(error => console.log(error))

    }

    loadNew = () => {
        this.loadFeed()
    }

    render() {

        //console.log(this.state.photo_feed)
        return (
            <View style={{ flex: 1 }}>
                {this.state.loading == true ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                        <FlatList
                            refreshing={this.state.refresh}
                            onRefresh={this.loadNew}
                            data={this.state.photo_feed}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}
                            renderItem={({ item, index }) => (
                                <View key={index} style={{ width: '100%', overflow: 'hidden', marginBottom: 5, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'grey' }}>
                                    <View style={{ padding: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity
                                            onPress={() => { this.props.navigation.navigate('User', { userId: item.authorId }); console.log(item.author) }}>
                                            <Text>{item.author.toString()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Image
                                            source={{ uri: item.url }}
                                            style={{ resizeMode: 'cover', width: '100%', height: 275 }}
                                        />
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Text>{item.caption}</Text>

                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Comments', { photoId: item.id })}>
                                            <Text style={{ color: 'blue', marginTop: 10, textAlign: 'center' }}>[ View comments ]</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            )}
                        />
                    )}
            </View>
        )
    }

}


