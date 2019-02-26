import React from 'react';

let state = {
	loaded: '',
	src: '',
}
export default class LazyImg extends React.PureComponent {
	_isMounted = false;
	constructor(props){
		super(props);
		this.state = state;
	}

	componentDidMount() {
		this._isMounted = true;
		if (this._isMounted)
			this.setState(state);
		if (this._isMounted && this.props.src)
			this.loadImage();
	}
	
	componentDidUpdate(prevProps) {
		if (this._isMounted && (this.props.src !== prevProps.src)) {
			if (this.props.src)
				this.loadImage(true);
		}
	}
	componentWillUnmount() {
		this._isMounted = false;
	}
	
	loadImage(forceAnimate) {
		this.$img = document.createElement('img');
		this.$img.src = this.props.src;
		if (this.$img.complete && this._isMounted) {
			this.$img.remove();
			this.setState({ loaded: forceAnimate ? 'loaded' : 'preloaded', src: this.props.src });
		} else {
			this.$img.onload = this.onLoad;
			this.$img.onerror = this.onError;
		}
	}
	
	onLoad = () => {
		this.$img.remove();
		if (this._isMounted)
			this.setState({ loaded: 'loaded', src: this.props.src });
	}
	
	onError = () => {
		this.$img.remove();
		if (this._isMounted)
			this.setState({ loaded: 'failed' });
	}
	
	render() {
		const { children = null, style = {}, className = '', placeholder = null } = this.props;
		const { loaded, src } = this.state;
		
		return (
			<figure style={style} className={`image ${className}`}>
			<div className={`lazy ${loaded}`} style={{ backgroundImage: `url('${src}')` }}/>
			{loaded ? null : placeholder}
			{children}
			</figure>
			);
		}
	}