const clientId='08eec6cbbb164555bb721479af24fe3d';
const redirectUri='http://localhost:3000/';

let access_token;

const Spotify = {
  getAccessToken() {
    if(access_token) {
      return access_token;
    } else {
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const userExpirationTokenMatch = window.location.href.match(/expires_in=([^&]*)/);
      if(accessTokenMatch && userExpirationTokenMatch) {
        access_token = accessTokenMatch[1];
        let expiretime = Number(userExpirationTokenMatch[1]);
        window.setTimeout(() => access_token = '', expiretime * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        }
      }
    },

  search(term) {
    //const accessToken =
    Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${access_token}`}
    }).then(response => response.json()).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
    });
  },

  savePlaylist(name, trackURIs) {
    if (name && trackURIs) {
      const access_token = Spotify.getAccessToken();
      const headers = {Authorization: `Bearer ${access_token}`};
      let userId = '';
      return fetch(`https://api.spotify.com/v1/me` , {
        headers: headers}
      ).then(response => response.json()).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name:name})
        }).then (response => response.json()).then(jsonResponse => {
          const playlistID = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
          }
        );
      });
    });
    } else {
      return;
    }
  }
}

export default Spotify;
