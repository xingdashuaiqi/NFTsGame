import React, { Component } from 'react';
import axios from 'axios';

class PoloPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Polo: this.props.Polo,
      _style: this.props._style,
      _className: this.props._className,
      jsonUrl: `https://cloudflare-ipfs.com/ipfs/bafybeiar2rxh7eq56a5tn4vgbq2abksmlrs6tysyj6fbt2o2fdjiuubbvi/${this.props.Polo.level}.json`,
      imageUrl: "",
      bo: this.props.bo
    };
    console.log(this.props.Polo)
  }

  async componentDidMount() {
    this.setState({ jsonUrl: `https://cloudflare-ipfs.com/ipfs/bafybeiar2rxh7eq56a5tn4vgbq2abksmlrs6tysyj6fbt2o2fdjiuubbvi/${this.props.Polo.level}.json`,  bo:this.props.bo});
    await this.fetchImageData(); // 在挂载后立即触发IPFS操作
  }

  async componentDidUpdate(prevProps) {
    if (this.props.Polo && prevProps !== this.props) {
      const level = this.props.Polo.level.toString(); // 将数字转换为字符串
      console.log(this.props.Polo.level);
      console.log(level);
      this.setState(
        {
          jsonUrl: `https://cloudflare-ipfs.com/ipfs/bafybeiar2rxh7eq56a5tn4vgbq2abksmlrs6tysyj6fbt2o2fdjiuubbvi/${level}.json`,
          bo: prevProps.bo
        },
        () => {
          console.log(this.state.jsonUrl);
          this.fetchImageData(); // 仍然保留在 componentDidUpdate 中的 IPFS 操作
        }
      );
    }
  }
  async fetchImageData() {
    try {
      // 发起IPFS请求，使用axios库
      const response = await axios.get(this.state.jsonUrl, { responseType: 'json' });
      console.log(this.state.jsonUrl)
      const jsonData = response.data;
      const imageUrl = jsonData.image;
      // 将 IPFS URL 转换成 Cloudflare IPFS 网关的 URL
      const imageUrlTransformed = imageUrl.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
      // 更新组件的状态以包含图片 URL
      this.setState({
        Polo: this.props.Polo,
        _style: this.props._style,
        _className: this.props._className,
        tokenId: this.props.Polo.level,
        jsonUrl: this.state.jsonUrl,
        imageUrl: imageUrlTransformed // 使用转换后的URL
      });
      console.log(imageUrl)
    } catch (error) {
      console.error('Error fetching JSON file from IPFS:', error);
    }
  }

  render() {
    var _style = this.state._style || [];
    var _className = this.state._className;
    if (this.state.Polo !== undefined) {
      _className = "polo-parts head-visible-1 eye-visible-1 shirt-visible-1";
    }
    if (this.state.bo === 1) {
      console.log(this.state.bo)
      return (
        <div className={_className} id="polo-parts">
   
          <div 
            style={{
              width: '231px',
              height: '343px',
              position: 'relative', // 设置相对定位
              overflow: 'hidden',
              top: '-232px',
              left: '16px',
              clip: 'rect(0px, 269px, 200px, 0px)', // 指定裁剪区域的坐标（上，右，下，左）
            }}
          >
            <img
              src={this.state.imageUrl}
              alt="Polo"
              style={{
              
                width: '100%', // 图像宽度设置为100%，以适应裁剪框
                position: 'absolute',
                top: '0px', // 图像位置设置为顶部
                left: '-1px', // 图像位置设置为左侧
              }}
            />
            </div>
          </div>

      );
    }
    else if(this.state.bo === 2){ console.log(this.state.bo)
      return (
        <div className={_className} id="polo-parts">
       
          <div 
            style={{
              width: '219px',
              height: '493px',
              position: 'relative', // 设置相对定位
              overflow: 'hidden',
              top: '-199px',
              left: '80px',
              clip: 'rect(0px, 269px, 200px, 0px)', // 指定裁剪区域的坐标（上，右，下，左）
            }}
          >
            <img
              src={this.state.imageUrl}
              alt="Polo"
              style={{
                // zIndex: 1, // 使用整数值，指定层叠级别
                width: '100%', // 图像宽度设置为100%，以适应裁剪框
                position: 'absolute',
                top: '157px', // 图像位置设置为顶部
                left: '-2px', // 图像位置设置为左侧
              }}
            />
          </div>
        </div>
  
      );}
    else{
      return (<div className={_className} id="polo-parts">
        <div 
          style={{
            width: '269px',
            height: '484px',
            position: 'relative', // 设置相对定位
            overflow: 'hidden',
            top: '-307px',
            left: '55px',
            clip: 'rect(0px, 269px, 200px, 0px)', // 指定裁剪区域的坐标（上，右，下，左）
          }}
        >
          <img
            src={this.state.imageUrl}
            alt="Polo"
            style={{
              // zIndex: 1, // 使用整数值，指定层叠级别
              width: '100%', // 图像宽度设置为100%，以适应裁剪框
              position: 'absolute',
              top: '110px', // 图像位置设置为顶部
              left: '0', // 图像位置设置为左侧
            }}
          />
          </div>
        </div>
     )
    }
  }
}
export default PoloPreview;
