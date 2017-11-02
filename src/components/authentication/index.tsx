/// <reference path="../../types/firebaseui.d.ts" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as firebaseui from 'firebaseui';

export class Authentication extends React.Component<
  Authentication.Props,
  Authentication.State
> {
  static contextTypes = {
    firebase: PropTypes.object,
  };

  constructor(props: Authentication.Props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  get signInOptions(): string[] {
    const result: string[] = [];
    if (this.props.twitter) {
      result.push(this.context.firebase.auth.TwitterAuthProvider.PROVIDER_ID);
    }
    if (this.props.facebook) {
      result.push(this.context.firebase.auth.FacebookAuthProvider.PROVIDER_ID);
    }
    if (this.props.google) {
      result.push(this.context.firebase.auth.GoogleAuthProvider.PROVIDER_ID);
    }
    if (this.props.github) {
      result.push(this.context.firebase.auth.GithubAuthProvider.PROVIDER_ID);
    }
    if (this.props.email) {
      result.push(this.context.firebase.auth.EmailAuthProvider.PROVIDER_ID);
    }
    if (this.props.phone) {
      result.push(this.context.firebase.auth.PhoneAuthProvider.PROVIDER_ID);
    }
    return result;
  }

  public componentWillMount(): void {
    if (!this.context.firebase) {
      throw new Error(
        'This component is placed under <Firebase /> of the @nju33/firebase',
      );
    }

    if (
      !(
        this.props.twitter ||
        this.props.facebook ||
        this.props.google ||
        this.props.github ||
        this.props.email ||
        this.props.phone
      )
    ) {
      throw new Error('Please specify at least one provider');
    }
  }

  public componentDidMount() {
    const ui = new firebaseui.auth.AuthUI(this.context.firebase.auth());
    const config = {
      signInOptions: this.signInOptions,
    };

    this.context.firebase
      .auth()
      .onAuthStateChanged(async (user: Authentication.User | null) => {
        if (user === null) {
          this.setState({authenticated: false});
          await import('firebaseui/dist/firebaseui.css');
          ui.start('#firebase-authentication-ui', config);
        }

        if (user) {
          this.setState({authenticated: true});
          if (typeof this.props.onLogged === 'function') {
            this.props.onLogged();
          }
        }
      });
  }

  public render() {
    let children: JSX.Element[];
    if (this.state.authenticated) {
      children = this.props.children as JSX.Element[];
    } else {
      children = [
        <div
          key="firebase-authentication-ui"
          id="firebase-authentication-ui"
        />,
      ];
    }

    return <div id="firebase-authentication">{children}</div>;
  }
}

export namespace Authentication {
  export interface Props extends Providers, Hooks {}

  export interface State {
    authenticated: boolean;
  }

  export interface Providers {
    twitter?: boolean;
    facebook?: boolean;
    github?: boolean;
    google?: boolean;
    email?: boolean;
    phone?: boolean;
  }
  export interface Hooks {
    onLogged?(): void;
  }

  // https://firebase.google.com/docs/reference/js/firebase.UserInfo#displayName
  export interface User {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    uid: string;
  }
}
