import React from 'react';
import YouTube from 'react-youtube';
import classnames from 'classnames';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import SimpleMediaCard from './SimpleMediaCard';
import Section from './Section';
import Member from './Member';
import Contact from './Contact';

const useStyles = makeStyles(theme => ({
  topImageContainer: {
    width: '100%',
    height: 400,
    [theme.breakpoints.up('sm')]: {
      height: 520,
    },
  },
  cardMedia: {
    position: 'absolute',
    filter: 'brightness(0.5)',
  },
  texts: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

export default () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div>
      <div className={classnames(classes.topImageContainer)}>
        <CardMedia
          image="./images/top.jpg"
          title="Bridge"
          className={classnames(classes.topImageContainer, classes.cardMedia)}
        />
        <div className={classnames(classes.topImageContainer, classes.texts)}>
          <Typography variant="h4" style={{ color: 'white', width: '100%', textAlign: 'center' }}>
            與長輩共遊 — 青松走走
          </Typography>
          <Typography variant="h4" style={{ color: 'white', width: '100%', textAlign: 'center' }}>
            <br />
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              style={{
                borderWidth: 2,
                borderColor: theme.palette.secondary.main,
              }}
            >
              立即體驗
            </Button>
          </div>
        </div>
      </div>
      <Section
        title="青松走走"
        subtitle="讓我們在自己家走出健康快樂的生活"
      >
        <div style={{ width: '100%', height: 90 }} />
        {/* <div style={{ width: '100%', height: 500 }} /> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{ maxWidth: 900, margin: '0px auto 0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
          >
            <Member
              image="./mail-assets/logo.png"
              name="Rick Chen"
              title="Maintainer"
              discription="The maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework."
            />
            <Member
              image="./mail-assets/logo.png"
              name="Rick Chen"
              title="Maintainer"
              discription="The maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework."
            />
          </div>
          <div
            style={{ maxWidth: 900, margin: '0px auto 0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
          >
            <Member
              image="./mail-assets/logo.png"
              name="Rick Chen"
              title="Maintainer"
              discription="The maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework."
            />
            <Member
              image="./mail-assets/logo.png"
              name="Rick Chen"
              title="Maintainer"
              discription="The maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework, the maintainer of this framework."
            />
          </div>
        </div>
      </Section>
      <Section
        grey
        title="Nyan Cat 100 hours"
      >
        <div
          style={{ maxWidth: 900, margin: '0px auto 0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
        >
          <YouTube
            videoId="wZZ7oFKsKzY"
            opts={{
              width: 300,
              height: 200,
              playerVars: { // https://developers.google.com/youtube/player_parameters
                // autoplay: 1,
              },
            }}
            onReady={() => {
              console.log('onReady');
            }}
          />
        </div>
      </Section>
      <Section
        title="Testimonials"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
          >
            <SimpleMediaCard />
            <SimpleMediaCard />
          </div>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
          >
            <SimpleMediaCard />
            <SimpleMediaCard />
          </div>
        </div>
        <div
          style={{ maxWidth: 500, margin: '0px auto 0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: 16 }}
        >
          <Button color="primary">
            More...
          </Button>
        </div>
      </Section>
      <Section
        grey
        title="聯絡我們"
      >
        <Contact />
      </Section>
      <div
        style={{
          background: grey[900],
          padding: 36,
        }}
      >
        <div
          style={{ maxWidth: 900, margin: '0px auto 0px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}
        >
          <Typography variant="body1" style={{ color: 'white', width: '100%', textAlign: 'center' }}>
            Az React Material UI
          </Typography>
          <div style={{ width: '100%', height: 20 }} />
        </div>
      </div>
    </div>
  );
};
