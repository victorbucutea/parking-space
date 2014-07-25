package ro.sft.parking.util;

import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.TranslateAnimation;

/**
 * Created by VictorBucutea on 21.07.2014.
 */
public class Anim {


    public static void slideOutBottom(final View view) {
        TranslateAnimation animate = new TranslateAnimation(0, 0, 0, view.getHeight());
        animate.setDuration(500);
        animate.setAnimationListener(new DefaultAnimationListener() {
            @Override
            public void onAnimationEnd(Animation animation) {
                view.setVisibility(View.GONE);
            }
        });
        view.startAnimation(animate);
    }

    public static void slideInBottom(View v) {
        TranslateAnimation animate = new TranslateAnimation(0, 0, v.getHeight(), 0);
        animate.setDuration(500);

        v.startAnimation(animate);
        v.setVisibility(View.VISIBLE);
    }

    public static void slide(View v, int fromYDelta, int toYDelta) {
        TranslateAnimation animate = new TranslateAnimation(0, 0, fromYDelta, toYDelta);
        animate.setDuration(500);
        v.startAnimation(animate);
    }


    public static class DefaultAnimationListener implements AnimationListener {

        @Override
        public void onAnimationStart(Animation animation) {

        }

        @Override
        public void onAnimationEnd(Animation animation) {

        }

        @Override
        public void onAnimationRepeat(Animation animation) {

        }
    }
}
