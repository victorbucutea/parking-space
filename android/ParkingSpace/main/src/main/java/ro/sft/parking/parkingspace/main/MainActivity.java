package ro.sft.parking.parkingspace.main;

import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.content.ClipData;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.DragEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.DragShadowBuilder;
import android.view.View.OnDragListener;
import android.view.View.OnTouchListener;
import android.view.Window;
import ro.sft.parking.parkingspace.main.LayoutFragment.OnFragmentInteractionListener;


public class MainActivity extends FragmentActivity implements OnFragmentInteractionListener {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Remove title bar
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);

        setContentView(R.layout.activity_main);
        findViewById(R.id.new_spot_marker).setOnTouchListener(onTouchListener);
        findViewById(R.id.new_spot_marker).setOnDragListener(dragListener);
        findViewById(R.id.showOptions).setOnClickListener(showOptionsMenu);

    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);

    }


    /**
     * Touch listener to use for in-layout UI controls to delay hiding the
     * system UI. This is to prevent the jarring behavior of controls going away
     * while interacting with activity UI.
     */
    View.OnTouchListener sayHelloListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            SayHelloDialog newFragment = new SayHelloDialog();
            newFragment.show(getFragmentManager(), "missiles");
            return true;
        }
    };

    View.OnDragListener dragListener = new OnDragListener() {
        public boolean onDrag(View v, DragEvent event) {
            int action = event.getAction();
            switch (action) {
                case DragEvent.ACTION_DRAG_STARTED:
                    System.out.println("Drag started");
                    break;
                case DragEvent.ACTION_DRAG_ENDED:
                    System.out.println("Drag ended");
                    break;

            }
            return true;
        }
    };

    View.OnTouchListener onTouchListener = new OnTouchListener() {
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (motionEvent.getAction() == MotionEvent.ACTION_DOWN) {
                ClipData data = ClipData.newPlainText("", "");
                DragShadowBuilder shadowBuilder = new View.DragShadowBuilder(view);
                view.startDrag(data, shadowBuilder, view, 0);
                //  view.setVisibility(View.INVISIBLE);
                return true;
            } else {
                return false;
            }
        }

    };

    View.OnClickListener showOptionsMenu = new View.OnClickListener(){

        LayoutFragment lf = new LayoutFragment();

        @Override
        public void onClick(View v) {
            System.out.println("Clicked button");
            FragmentTransaction ft = getFragmentManager().beginTransaction();
            ft.setCustomAnimations(R.animator.slide_in_left, R.animator.slide_out_right);

            System.out.println("lf is hidden :"+lf.isHidden());
            System.out.println("lf is added:"+lf.isHidden());
            if (!lf.isAdded()) {
                ft.add(R.id.mapLayout, lf);
                ft.addToBackStack(null);
                System.out.println("Showing options");
            } else {
                ft.hide(lf);
                ft.addToBackStack(null);
            }
            ft.commit();

        }
    };

    @Override
    public void onFragmentInteraction(Uri uri) {

    }
}
