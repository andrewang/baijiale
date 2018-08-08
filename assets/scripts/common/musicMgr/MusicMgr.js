var prefix = "resources/music/"
cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor: function () {
        //策划说默认0.5
        this.effectVolume = cc.sys.localStorage.getItem('effectVolume') || 0.5
        this.effectVolume = Number(this.effectVolume)
        this.musicVolume = cc.sys.localStorage.getItem('musicVolume') || 0.5
        this.musicVolume = Number(this.musicVolume)
    },

    init: function () {
        
    },

    playEffect: function (name, isLoop) {
        isLoop = isLoop || false
        return cc.audioEngine.play(cc.url.raw(prefix + name), isLoop, this.effectVolume)
    },

    playMusic: function (name) {
        this.bgmId = cc.audioEngine.play(cc.url.raw(prefix + name), true, this.musicVolume)
        return this.bgmId
    },

    //播放语音
    playVoice: function (name) {
        cc.log("播放语音", name)
        return cc.audioEngine.play(name, false, this.effectVolume)
    },

    //音量
    setEffectVolume: function (effectVolume) {
        this.effectVolume = effectVolume
        // cc.audioEngine.setEffectsVolume(this.effectVolume)
    },

    saveEffectVolume: function () {
        cc.sys.localStorage.setItem("effectVolume", this.effectVolume)
    },

    getEffectVolume: function () {
        return this.effectVolume
    },
    
    //音乐
    setMusicVolume: function (musicVolume) {
        this.musicVolume = musicVolume
        cc.audioEngine.setVolume(this.bgmId, this.musicVolume)
    },

    saveMusicVolume: function () {
        cc.sys.localStorage.setItem("musicVolume", this.musicVolume)
    },

    getMusicVolume: function () {
        return this.musicVolume
    },

    playResultEffect: function (ret) {
        if (0 == tableNums(ret.state_info)) {
            return
        }
        if (-1 != ret.state_info.state_list.indexOf(1)) {
            this.playEffect("result_zhuang_win.mp3")
        }
        else if (-1 != ret.state_info.state_list.indexOf(2)) {
            this.playEffect("result_xian_win.mp3")
        }
        else if (-1 != ret.state_info.state_list.indexOf(3)) {
            this.playEffect("result_he.mp3")
        }
    },

    stop: function (audioId) {
        if (audioId != null) {
            cc.audioEngine.stop(audioId)
        }
    },

    playLobbyBgm: function () {
        this.lobbyBgmId = this.playMusic("lobby_music.mp3")
    },

    stopLobbyBgm: function () {
      this.stop(this.lobbyBgmId)  
    },

});
