package ro.sft.parking.util;

import android.content.Context;
import android.widget.Toast;

/**
 * Created by VictorBucutea on 21.07.2014.
 */
public class Util{


    public static void showToast(String msg, Context ctxt) {
//        System.out.println(msg);
        Toast.makeText(ctxt, msg, Toast.LENGTH_SHORT).show();
    }
}
