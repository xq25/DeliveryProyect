import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private googleProvider = new GoogleAuthProvider();
  private githubProvider = new GithubAuthProvider();
  private microsoftProvider = new OAuthProvider('microsoft.com');

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  // ==========================================
  // LOGIN CON GOOGLE
  // ==========================================
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);

      const user = result.user;
      const token = await user.getIdToken();

      return {
        user: {
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          token: token
        },
      };

    } catch (e: any) {
      console.error("Error Google Login:", e);
      throw e;
    }
  }

  // ==========================================
  // LOGIN CON GITHUB
  // ==========================================
  async loginWithGithub() {
    try {
      const result = await signInWithPopup(this.auth, this.githubProvider);

      const user = result.user;
      const token = await user.getIdToken();

      return {
        user: {
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          token: token
        }
      };

    } catch (e: any) {
      console.error("Error GitHub Login:", e);
      throw e;
    }
  }
  async loginWithMicrosoft() {
    try {
      const result = await signInWithPopup(this.auth, this.microsoftProvider);

      const user = result.user;
      const token = await user.getIdToken();

      return {
        user: {
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          token: token
        }
      };

    } catch (e: any) {
      console.error("Error Microsoft Login:", e);
      throw e;
    }
  }
}
