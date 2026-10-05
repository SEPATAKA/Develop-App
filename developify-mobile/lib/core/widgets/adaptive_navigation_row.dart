import 'package:flutter/material.dart';
import 'package:developify_mobile/core/theme/app_theme.dart';

class AdaptiveNavigationRow extends StatelessWidget {
  const AdaptiveNavigationRow({
    super.key,
    required this.labels,
    required this.children,
  }) : assert(labels.length == children.length);

  final List<String> labels;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      var requiredWidth = 48.0;
      for (final label in labels) {
        final painter = TextPainter(
          text: TextSpan(
            text: label,
            style: AppTextStyles.text(12, weight: FontWeight.w500),
          ),
          textDirection: Directionality.of(context),
          textScaler: MediaQuery.textScalerOf(context),
        )..layout();
        if (painter.width + 16 > requiredWidth) {
          requiredWidth = painter.width + 16;
        }
        painter.dispose();
      }
      if (requiredWidth * children.length <= constraints.maxWidth) {
        return Row(
          children: [for (final child in children) Expanded(child: child)],
        );
      }
      final columns = (constraints.maxWidth / requiredWidth).floor().clamp(
        1,
        3,
      );
      return Wrap(
        alignment: WrapAlignment.center,
        children: [
          for (final child in children)
            SizedBox(width: constraints.maxWidth / columns, child: child),
        ],
      );
    },
  );
}
