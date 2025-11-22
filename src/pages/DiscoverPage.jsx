import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Play, Pause, Music2, Clock, User, Disc, Volume2, VolumeX, SkipBack, SkipForward, Settings, Check, ChevronDown, X, Maximize2, Minimize2, Repeat, Repeat1, Shuffle, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getApiUrl } from '@/config/api';

// 音质选项
const QUALITY_OPTIONS = [
  { value: 'standard', label: '标准音质', desc: '流畅播放' },
  { value: 'exhigh', label: '极高品质', desc: '高品质' },
  { value: 'lossless', label: '无损音质', desc: 'CD品质' },
  { value: 'hires', label: 'Hi-Res', desc: '超高品质' },
  { value: 'jyeffect', label: '高清环绕声', desc: '环绕音效' },
  { value: 'sky', label: '沉浸环绕声', desc: '沉浸体验' },
  { value: 'jymaster', label: '超清母带', desc: '母带级' }
];

const DiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [defaultQuality, setDefaultQuality] = useState('standard'); // 全局默认音质
  const [currentQuality, setCurrentQuality] = useState('standard'); // 当前播放音质
  const [showQualityMenu, setShowQualityMenu] = useState(false); // 显示音质菜单
  const [showGlobalQualityMenu, setShowGlobalQualityMenu] = useState(false); // 显示全局音质设置
  const [showLyric, setShowLyric] = useState(false); // 显示歌词页面
  const [lyricMode, setLyricMode] = useState('mini'); // 歌词模式: mini(封面居中4行歌词) / full(全歌词滚动)
  const [parsedLyrics, setParsedLyrics] = useState([]); // 解析后的歌词数组
  const [playMode, setPlayMode] = useState('order'); // 播放模式: order(顺序) / random(随机) / single(单曲循环)
  const [playerExpanded, setPlayerExpanded] = useState(true); // 播放器展开/收起状态
  const audioRef = useRef(null);
  const qualityMenuRef = useRef(null);
  const playerQualityMenuRef = useRef(null);
  const lyricContainerRef = useRef(null);

  // 搜索音乐
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/music/search?name=${encodeURIComponent(searchTerm)}&limit=50`);
      const data = await response.json();
      
      if (data.code === 200) {
        setSearchResults(data.data || []);
      } else {
        console.error('搜索失败');
      }
    } catch (error) {
      console.error('搜索错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 播放音乐
  const handlePlay = async (song, quality = null) => {
    try {
      const useQuality = quality || defaultQuality;
      
      // 如果点击的是当前播放的歌曲，则暂停/继续
      if (currentSong?.id === song.id && currentQuality === useQuality) {
        if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
        } else {
          audioRef.current?.play();
          setIsPlaying(true);
        }
        return;
      }

      // 获取音乐详情
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/music/detail?id=${song.id}&level=${useQuality}&type=json`);
      const data = await response.json();
      
      if (data.status === 200 && data.url) {
        setCurrentSong({
          ...song,
          url: data.url,
          pic: data.pic,
          lyric: data.lyric,
          level: data.level
        });
        setCurrentQuality(useQuality);
        setIsPlaying(true);
        // 解析歌词
        if (data.lyric) {
          setParsedLyrics(parseLyric(data.lyric));
        }
        
        // 等待音频元素更新后播放
        setTimeout(() => {
          audioRef.current?.play();
        }, 100);
      }
    } catch (error) {
      console.error('播放错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换音质
  const handleQualityChange = async (quality) => {
    if (!currentSong) return;
    
    setShowQualityMenu(false);
    
    // 保存当前播放位置和状态
    const wasPlaying = isPlaying;
    const currentPosition = audioRef.current?.currentTime || 0;
    
    // 重新获取该音质的音乐
    await handlePlay(currentSong, quality);
    
    // 恢复播放位置
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = currentPosition;
        if (wasPlaying) {
          audioRef.current.play();
        }
      }
    }, 200);
  };

  // 解析歌词 (LRC格式)
  const parseLyric = (lyricString) => {
    if (!lyricString) return [];
    const lines = lyricString.split('\n');
    const lyrics = [];
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
    
    lines.forEach(line => {
      const matches = [...line.matchAll(timeRegex)];
      if (matches.length > 0) {
        const text = line.replace(timeRegex, '').trim();
        if (text) {
          matches.forEach(match => {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const milliseconds = parseInt(match[3].padEnd(3, '0'));
            const time = minutes * 60 + seconds + milliseconds / 1000;
            lyrics.push({ time, text });
          });
        }
      }
    });
    
    return lyrics.sort((a, b) => a.time - b.time);
  };

  // 获取当前歌词索引
  const getCurrentLyricIndex = () => {
    if (!parsedLyrics.length) return -1;
    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= parsedLyrics[i].time) {
        return i;
      }
    }
    return -1;
  };

  // 歌词自动滚动
  useEffect(() => {
    if (showLyric && lyricMode === 'full' && lyricContainerRef.current && parsedLyrics.length > 0) {
      const currentIndex = getCurrentLyricIndex();
      if (currentIndex >= 0) {
        const container = lyricContainerRef.current;
        const lyricElements = container.querySelectorAll('.lyric-line');
        const lyricElement = lyricElements[currentIndex];
        if (lyricElement) {
          lyricElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [currentTime, showLyric, lyricMode, parsedLyrics]);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查全局音质菜单
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(event.target)) {
        setShowGlobalQualityMenu(false);
      }
      // 检查播放器音质菜单
      if (playerQualityMenuRef.current && !playerQualityMenuRef.current.contains(event.target)) {
        setShowQualityMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 格式化时间
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 音频时间更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // 进度条拖动
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // 音量控制
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // 切换静音
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // 上一曲
  const handlePrevious = () => {
    if (!searchResults.length) return;
    const currentIndex = searchResults.findIndex(song => song.id === currentSong?.id);
    
    if (playMode === 'random') {
      // 随机播放
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * searchResults.length);
      } while (randomIndex === currentIndex && searchResults.length > 1);
      handlePlay(searchResults[randomIndex]);
    } else if (playMode === 'single') {
      // 单曲循环 - 从头播放
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // 顺序播放
      if (currentIndex > 0) {
        handlePlay(searchResults[currentIndex - 1]);
      } else {
        // 列表循环 - 跳到最后一首
        handlePlay(searchResults[searchResults.length - 1]);
      }
    }
  };

  const handleNext = () => {
    if (!searchResults.length) return;
    const currentIndex = searchResults.findIndex(song => song.id === currentSong?.id);
    
    if (playMode === 'random') {
      // 随机播放
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * searchResults.length);
      } while (randomIndex === currentIndex && searchResults.length > 1);
      handlePlay(searchResults[randomIndex]);
    } else if (playMode === 'single') {
      // 单曲循环 - 重新播放当前歌曲
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // 顺序播放
      if (currentIndex < searchResults.length - 1) {
        handlePlay(searchResults[currentIndex + 1]);
      } else {
        // 列表循环
        handlePlay(searchResults[0]);
      }
    }
  };

  // 切换播放模式
  const togglePlayMode = () => {
    const modes = ['order', 'random', 'single'];
    const currentModeIndex = modes.indexOf(playMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setPlayMode(nextMode);
  };

  // 获取播放模式图标和文字
  const getPlayModeInfo = () => {
    switch (playMode) {
      case 'random':
        return { icon: Shuffle, text: '随机播放' };
      case 'single':
        return { icon: Repeat1, text: '单曲循环' };
      default:
        return { icon: Repeat, text: '列表循环' };
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in pb-32">
      {/* 标题和搜索栏 */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Music2 className="text-primary" size={32} />
          <h1 className="font-display text-4xl font-medium text-text-main">音乐发现</h1>
        </div>

        {/* 搜索框和音质设置 */}
        <div className="flex items-start gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-surface border border-border rounded-xl p-2 shadow-xl">
                <Search className="ml-3 text-text-muted" size={24} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索你喜欢的音乐..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-lg placeholder:text-text-muted/50 text-text-main"
                />
                <Button type="submit" size="sm" className="rounded-lg" disabled={loading}>
                  {loading ? '搜索中...' : '搜索'}
                </Button>
              </div>
            </div>
          </form>

          {/* 全局音质设置 */}
          <div className="relative" ref={qualityMenuRef}>
            <Button
              variant="outline"
              size="sm"
              className="group flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95"
              onClick={() => setShowGlobalQualityMenu(!showGlobalQualityMenu)}
            >
              <Settings size={18} className="transition-transform duration-300 group-hover:rotate-90" />
              <span className="hidden sm:inline">
                {QUALITY_OPTIONS.find(q => q.value === defaultQuality)?.label}
              </span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${showGlobalQualityMenu ? 'rotate-180' : ''}`} />
            </Button>

            {/* 音质下拉菜单 */}
            {showGlobalQualityMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl z-50 py-2 animate-slide-in">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">默认音质</p>
                </div>
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDefaultQuality(option.value);
                      setShowGlobalQualityMenu(false);
                    }}
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-surface-hover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
                  >
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-text-main">{option.label}</p>
                      <p className="text-xs text-text-muted">{option.desc}</p>
                    </div>
                    {defaultQuality === option.value && (
                      <Check size={16} className="text-primary animate-fade-in" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 快捷标签 */}
        <div className="flex flex-wrap gap-2">
          {['晚风', '告白气球', '稻香', '起风了', '年少有为', '半岛铁盒'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchTerm(tag);
                setTimeout(() => {
                  const form = document.querySelector('form');
                  form?.requestSubmit();
                }, 0);
              }}
              className="px-4 py-2 rounded-full bg-surface hover:bg-surface-hover border border-border text-sm text-text-muted hover:text-text-main cursor-pointer transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 搜索结果 */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-text-main">搜索结果</h2>
          <div className="grid gap-2">
            {searchResults.map((song, index) => (
              <Card 
                key={song.id} 
                className={`group hover:border-primary/50 transition-all cursor-pointer ${
                  currentSong?.id === song.id ? 'border-primary bg-primary/5' : 'bg-surface/50'
                }`}
                onClick={() => handlePlay(song)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* 序号/播放按钮 */}
                    <div className="w-12 flex-shrink-0 flex items-center justify-center">
                      {currentSong?.id === song.id && isPlaying ? (
                        <div className="text-primary flex items-center justify-center">
                          <Pause size={20} />
                        </div>
                      ) : (
                        <div className="group-hover:hidden text-text-muted text-sm">
                          {index + 1}
                        </div>
                      )}
                      <div className={`${currentSong?.id === song.id && isPlaying ? 'hidden' : 'hidden group-hover:flex'} items-center justify-center`}>
                        <Play size={20} className="text-primary" />
                      </div>
                    </div>

                    {/* 歌曲信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-main truncate">{song.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {song.artists.map(a => a.name).join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Disc size={14} />
                          {song.album.name}
                        </span>
                      </div>
                    </div>

                    {/* 时长 */}
                    <div className="flex items-center gap-1 text-text-muted text-sm flex-shrink-0">
                      <Clock size={14} />
                      {song.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 播放器 - 使用Portal渲染到body，确保全局播放 */}
      {currentSong && createPortal(
        <div className={`fixed bottom-0 left-64 right-0 bg-surface border-t border-border shadow-2xl z-50 transition-all duration-300 ${playerExpanded ? '' : ''}`}>
          {/* 收起/展开按钮 */}
          <button
            onClick={() => setPlayerExpanded(!playerExpanded)}
            className="absolute -top-6 right-8 p-1 bg-surface/80 border border-border/50 rounded-t hover:bg-surface hover:border-border transition-all duration-200 group"
            title={playerExpanded ? '收起播放器' : '展开播放器'}
          >
            <ChevronUp size={12} className={`text-text-muted group-hover:text-text-main transition-all duration-300 ${playerExpanded ? '' : 'rotate-180'}`} />
          </button>

          <div className={`max-w-7xl mx-auto transition-all duration-300 ${playerExpanded ? 'p-4' : 'px-4 py-1'}`}>

            {/* 进度条 */}
            <div className={`transition-all duration-300 ${playerExpanded ? 'mb-3' : 'mb-0'}`}>
              <div 
                className={`bg-surface-hover rounded-full cursor-pointer group transition-all ${playerExpanded ? 'h-1' : 'h-1'}`}
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-primary rounded-full relative group-hover:h-1.5 transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              {playerExpanded && (
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              )}
            </div>

            {/* 播放器控制 */}
            <div className={`flex items-center justify-between transition-all duration-300 ${playerExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              {/* 当前播放信息 */}
              <div 
                className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer group"
                onClick={() => setShowLyric(true)}
                title="点击查看歌词"
              >
                {currentSong.pic ? (
                  <img 
                    src={currentSong.pic} 
                    alt={currentSong.name}
                    className="w-14 h-14 rounded-lg object-cover shadow-md group-hover:shadow-xl transition-shadow"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-surface-hover flex items-center justify-center group-hover:bg-surface transition-colors">
                    <Music2 size={24} className="text-text-muted" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-medium text-text-main truncate group-hover:text-primary transition-colors">{currentSong.name}</h4>
                  <p className="text-sm text-text-muted truncate">
                    {currentSong.artists.map(a => a.name).join(', ')}
                  </p>
                </div>
              </div>

              {/* 播放控制 */}
              <div className="flex items-center gap-4">
                {/* 播放模式 */}
                <button
                  onClick={togglePlayMode}
                  className={`transition-all duration-200 hover:scale-110 active:scale-95 ${
                    playMode === 'order' 
                      ? 'text-text-muted hover:text-text-main' 
                      : 'text-primary hover:text-primary-hover'
                  }`}
                  title={getPlayModeInfo().text}
                >
                  {React.createElement(getPlayModeInfo().icon, { size: 20 })}
                </button>
                
                <div className="h-6 w-px bg-border"></div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handlePrevious}
                  disabled={!searchResults.length}
                >
                  <SkipBack size={20} />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full w-12 h-12 p-0"
                  onClick={() => handlePlay(currentSong)}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleNext}
                  disabled={!searchResults.length}
                >
                  <SkipForward size={20} />
                </Button>
              </div>

              {/* 音质和音量控制 */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* 音质选择器 */}
                <div className="relative" ref={playerQualityMenuRef}>
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-hover hover:bg-surface text-text-muted hover:text-text-main transition-all duration-200 hover:scale-105 active:scale-95 text-sm"
                    title="切换音质"
                  >
                    <Disc size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                    <span className="hidden md:inline font-medium">
                      {QUALITY_OPTIONS.find(q => q.value === currentQuality)?.label}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showQualityMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* 音质切换菜单 */}
                  {showQualityMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-56 bg-surface border border-border rounded-xl shadow-2xl z-50 py-2 animate-slide-up">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">切换音质</p>
                        <p className="text-xs text-text-muted/70 mt-0.5">当前播放：{currentSong.name}</p>
                      </div>
                      {QUALITY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleQualityChange(option.value)}
                          disabled={currentQuality === option.value}
                          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-surface-hover transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-text-main">{option.label}</p>
                            <p className="text-xs text-text-muted">{option.desc}</p>
                          </div>
                          {currentQuality === option.value && (
                            <Check size={16} className="text-primary animate-fade-in" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 音量控制 */}
                <div className="h-6 w-px bg-border mx-1"></div>
                <button onClick={toggleMute} className="text-text-muted hover:text-text-main transition-colors">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-surface-hover rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>
          </div>

          {/* 音频元素 */}
          <audio
            ref={audioRef}
            src={currentSong.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>,
        document.body
      )}

      {/* 空状态 */}
      {!loading && searchResults.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Music2 className="mx-auto text-text-muted mb-4" size={48} />
          <p className="text-text-muted">没有找到相关音乐，试试其他关键词吧</p>
        </div>
      )}

      {!searchTerm && (
        <div className="text-center py-12">
          <Music2 className="mx-auto text-text-muted mb-4" size={48} />
          <p className="text-text-muted">输入歌曲名称开始探索音乐世界</p>
        </div>
      )}

      {/* 歌词显示页面 - 使用Portal渲染到body */}
      {showLyric && currentSong && createPortal(
        <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-surface z-[100] overflow-hidden transition-opacity duration-300 flex flex-col">
          {/* 头部操作栏 */}
          <div className="flex-shrink-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-main">{currentSong.name}</h2>
                <p className="text-text-muted">{currentSong.artists.map(a => a.name).join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLyricMode(lyricMode === 'mini' ? 'full' : 'mini')}
                  className="p-2 rounded-lg bg-surface/50 hover:bg-surface text-text-muted hover:text-text-main transition-all duration-200 hover:scale-110 active:scale-95"
                  title={lyricMode === 'mini' ? '切换到全屏歌词' : '切换到封面模式'}
                >
                  {lyricMode === 'mini' ? <Maximize2 size={20} /> : <Minimize2 size={20} />}
                </button>
                <button
                  onClick={() => setShowLyric(false)}
                  className="p-2 rounded-lg bg-surface/50 hover:bg-surface text-text-muted hover:text-text-main transition-all duration-200 hover:scale-110 active:scale-95"
                  title="关闭歌词"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Mini 模式 - 封面居中 + 4行歌词 */}
          {lyricMode === 'mini' && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden animate-slide-up">
              {/* 黑胶唱片效果 */}
              <div className="relative mb-12 animate-fade-in">
                <div className={`w-72 h-72 rounded-full overflow-hidden shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
                  <img 
                    src={currentSong.pic} 
                    alt={currentSong.name}
                    className="w-full h-full object-cover"
                  />
                  {/* 黑胶质感 */}
                  <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30"></div>
                </div>
                {/* 中心圆盘（不旋转） */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-background/90 shadow-inner flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-surface border-2 border-border"></div>
                  </div>
                </div>
              </div>

              {/* 滚动歌词 - 4行 */}
              <div className="w-full max-w-2xl space-y-4 text-center animate-slide-in">
                {parsedLyrics.length > 0 ? (
                  (() => {
                    const currentIndex = getCurrentLyricIndex();
                    const displayStart = Math.max(0, currentIndex - 1);
                    const displayEnd = Math.min(parsedLyrics.length, displayStart + 4);
                    return parsedLyrics.slice(displayStart, displayEnd).map((lyric, index) => (
                      <p
                        key={index}
                        className={`text-lg transition-all duration-500 ${
                          displayStart + index === currentIndex
                            ? 'text-3xl font-medium text-text-main scale-110'
                            : 'text-text-muted opacity-60'
                        }`}
                      >
                        {lyric.text}
                      </p>
                    ));
                  })()
                ) : (
                  <p className="text-text-muted text-lg">暂无歌词</p>
                )}
              </div>
            </div>
          )}

          {/* Full 模式 - 全歌词滚动 */}
          {lyricMode === 'full' && (
            <div className="flex-1 overflow-hidden animate-slide-left">
              <div className="flex h-full">
                {/* 左侧小封面 */}
                <div className="w-48 flex-shrink-0 pl-6 py-6 animate-fade-in">
                  <div className="sticky top-6">
                    <div className="relative w-40 h-40">
                      <div className={`w-40 h-40 rounded-full overflow-hidden shadow-xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
                        <img 
                          src={currentSong.pic} 
                          alt={currentSong.name}
                          className="w-full h-full object-cover"
                        />
                        {/* 黑胶质感 */}
                        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30"></div>
                      </div>
                      {/* 中心圆盘（不旋转） */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-background/90 shadow-inner flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-surface border border-border"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右侧全歌词 */}
                <div className="flex-1 overflow-y-auto px-12 animate-slide-in">
                  <div className="max-w-3xl mx-auto py-12 space-y-8" ref={lyricContainerRef}>
                    {parsedLyrics.length > 0 ? (
                      parsedLyrics.map((lyric, index) => {
                        const currentIndex = getCurrentLyricIndex();
                        return (
                          <p
                            key={index}
                            className={`lyric-line text-2xl transition-all duration-300 ${
                              index === currentIndex
                                ? 'text-text-main font-medium scale-105'
                                : index < currentIndex
                                ? 'text-text-muted/40'
                                : 'text-text-muted/60'
                            }`}
                          >
                            {lyric.text}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-text-muted text-2xl text-center">暂无歌词</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default DiscoverPage;
