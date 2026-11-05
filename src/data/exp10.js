const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 10,
  title: 'Tip Calculator',
  question: `Tip Calculator
• Enter bill amount.
• Select 10%, 15% or 20% tip.
• Display tip amount and total bill.
• Keep calculation logic in a separate Kotlin class.
• Include JUnit unit test and Compose UI test.
• Demonstrate one deliberate bug, a failing test and its correction.`,
  gradle: [
    {
      name: 'app/build.gradle.kts',
      code: `dependencies {
    // These are already present in the Empty Activity template.
    // Check that they exist, add them if missing:
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation(platform("androidx.compose:compose-bom:2024.10.01"))
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'TipCalculator.kt (STEP 1 - BUGGY version)',
      path: P,
      code: `package com.example.madlab

class TipCalculator {

    // BUG: divides by 10 instead of 100
    fun tip(bill: Double, percent: Int): Double {
        return bill * percent / 10
    }

    fun total(bill: Double, percent: Int): Double {
        return bill + tip(bill, percent)
    }
}
`,
    },
    {
      name: 'TipCalculatorTest.kt (JUnit unit test)',
      path: 'app/src/test/java/com/example/madlab/',
      code: `package com.example.madlab

import org.junit.Assert.assertEquals
import org.junit.Test

class TipCalculatorTest {

    @Test
    fun tip_isCorrect() {
        // 10% of 200 should be 20
        assertEquals(20.0, TipCalculator().tip(200.0, 10), 0.01)
    }

    @Test
    fun total_isCorrect() {
        // 200 + 15% tip (30) = 230
        assertEquals(230.0, TipCalculator().total(200.0, 15), 0.01)
    }
}

// STEP 2: Right-click this file > Run 'TipCalculatorTest'
// With the buggy version BOTH tests FAIL:
//   tip_isCorrect   -> expected:<20.0> but was:<200.0>
//   total_isCorrect -> expected:<230.0> but was:<500.0>
`,
    },
    {
      name: 'TipCalculator.kt (STEP 3 - FIXED version)',
      path: P,
      code: `package com.example.madlab

class TipCalculator {

    // FIXED: divide by 100 for a percentage
    fun tip(bill: Double, percent: Int): Double {
        return bill * percent / 100
    }

    fun total(bill: Double, percent: Int): Double {
        return bill + tip(bill, percent)
    }
}

// STEP 4: Run TipCalculatorTest again. Both tests now PASS.
`,
    },
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                TipScreen()
            }
        }
    }
}

@Composable
fun TipScreen() {
    var bill by remember { mutableStateOf("") }
    var percent by remember { mutableStateOf(10) }
    val calc = TipCalculator()
    val amount = bill.toDoubleOrNull() ?: 0.0

    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        OutlinedTextField(
            value = bill,
            onValueChange = { bill = it },
            label = { Text("Bill amount") },
            modifier = Modifier.testTag("bill")
        )

        Row {
            listOf(10, 15, 20).forEach { p ->
                Button(
                    onClick = { percent = p },
                    modifier = Modifier.padding(4.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (p == percent) Color(0xFF4B9CD3) else Color.Gray
                    )
                ) {
                    Text(p.toString() + "%")
                }
            }
        }

        Text("Tip: " + "%.2f".format(calc.tip(amount, percent)), Modifier.testTag("tip"))
        Text("Total: " + "%.2f".format(calc.total(amount, percent)), Modifier.testTag("total"))
    }
}
`,
    },
    {
      name: 'TipScreenTest.kt (Compose UI test)',
      path: 'app/src/androidTest/java/com/example/madlab/',
      code: `package com.example.madlab

import androidx.compose.ui.test.assertTextEquals
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import org.junit.Rule
import org.junit.Test

class TipScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun tipAndTotal_areShown() {
        composeTestRule.setContent { TipScreen() }

        composeTestRule.onNodeWithTag("bill").performTextInput("200")
        composeTestRule.onNodeWithText("10%").performClick()

        composeTestRule.onNodeWithTag("tip").assertTextEquals("Tip: 20.00")
        composeTestRule.onNodeWithTag("total").assertTextEquals("Total: 220.00")
    }
}

// Run on an emulator/device: right-click > Run 'TipScreenTest'
`,
    },
  ],
  explain: [
    'TipCalculator is a plain Kotlin class with the maths only. It has no screen code, so it is easy to test.',
    'TipScreen shows the text field, the 10% / 15% / 20% buttons, and the Tip and Total texts. The selected percent button turns blue.',
    'Deliberate bug demo: Step 1 uses "/ 10" (wrong). Step 2: run the JUnit test, it FAILS (tip becomes 200 instead of 20). Step 3: change to "/ 100". Step 4: run again, it PASSES.',
    'JUnit unit tests go in the "test" folder and run on your computer (no emulator needed).',
    'The Compose UI test goes in the "androidTest" folder and needs an emulator. It types 200, clicks 10% and checks the texts.',
    'testTag("bill") etc. gives each element a name so the test can find it.',
    'Create the screen file first, then the tests: the tests use TipScreen() and TipCalculator().',
  ],
}
